<?php

/**
 * 微信小程序配置对接插件之WechatTe_Action接口类
 *
 * @package WechatTe
 * @author  友儿
 * @version 3.0.0
 * @link https://niuzheng.net
 */

class WechatTe_Action extends Typecho_Widget implements Widget_Interface_Do
{
    protected static $plugin_config = null;
    private $db;
    protected $response;

    public function __construct($request, $response, $params = null)
    {
        parent::__construct($request, $response, $params);

        if (!$this->check_agent()) {
            $response->throwJson(array(
                'status' => 9000,
                'data' => 'agent error'
            ));
        }

        self::get_config();

        $params = $this->all();
        $this->response = $response;
        if (!$this->check_sign($params)) {
            $response->throwJson(array(
                'status' => 9001,
                'data' => 'sign error'
            ));
        }

        if (isset($params['method']) && !empty($params['method'])) {
            $method = '_' . $params['method'];
            if (method_exists($this, $method)) {
                $cache_driver = self::$plugin_config->cache_driver;
                $cache_time = self::$plugin_config->cachetime;
                $this->db = Typecho_Db::get();
                if ($cache_driver != '0' && $cache_time > 0) {
                    $file_path = "Driver/$cache_driver.php";
                    require_once 'Driver/ICache.php';
                    require_once $file_path;
                    $cache_config = new stdClass();
                    $cache_config->host = self::$plugin_config->host;
                    $cache_config->port = self::$plugin_config->port;
                    $cache_config->auth = self::$plugin_config->auth;
                    $cache_config->expire = self::$plugin_config->cachetime;
                    $key = get_called_class() . $method . md5(json_encode($params));
                    $cache = call_user_func(array($cache_driver, 'getInstance'), $cache_config);
                    $data = $cache->get($key);
                    if (!$data) {
                        $data = call_user_func_array([$this, $method], [$params]);
                        $json = json_encode($data);
                        $cache->set($key, $json);
                        $response->throwJson($data);
                    }
                    echo $data;
                    exit();
                }
                $data = call_user_func_array([$this, $method], [$params]);
                $response->throwJson($data);
            }
        }
    }

    public function _search($params)
    {
        $regex = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
        $keyword = preg_replace($regex, '', $params['keyword']);
        if (!isset($keyword) || empty($keyword)) {
            $this->response->throwJson(array(
                'status' => 9003,
                'data' => 'keyword error'
            ));
        }
        $page = isset($params['page']) && !empty($params['page']) ? $params['page'] : 1;

        $all = $this->db->fetchRow($this->db->select(array('COUNT(authorId)' => 'all'))->from('table.contents')->where('table.contents.type=?', 'post')->where('table.contents.status = ?', 'publish')->where("table.contents.title like '%$keyword%'"));

        $allpage = ceil($all['all'] / 10);
        $posts = $this->db->fetchAll($this->db->select('table.contents.cid,title,text,views,likes,str_value,created')->from('table.contents')->join('table.fields', 'table.fields.cid = table.contents.cid', Typecho_Db::LEFT_JOIN)->where("table.contents.title like '%$keyword%'")->where('table.fields.name = "thumbSmall"')->where('table.contents.type = ?', 'post')->where('status = ?', 'publish')->where('created < ?', time())->order('table.contents.created', Typecho_Db::SORT_DESC)->offset(($page - 1) * 10)->limit(10));
        $results = [];
        foreach ($posts as $result) {
            $result['created'] = date('Y-m-d', $result['created']);
            $result['text'] = mb_substr($result['text'], 15, 20, 'utf-8') . "...";
            $result['link'] = '/pages/detail/detail?cid=' . $result['cid'];
            $results[] = $result;
        }
        $link = [];
        $cover = [];
        $swiper = self::$plugin_config->swiper ? json_decode(self::$plugin_config->swiper, true) : [];
        foreach ($swiper as $key => $wheel) {
            $link[$key] = $wheel['link'];
            $cover[$key] = $wheel['cover'];
        }
        return ['list' => $results, 'allpage' => $allpage, 'page' => $page, 'links' => $link, 'covers' => $cover];
    }

    public function _list($params)
    {
        $page = isset($params['page']) && !empty($params['page']) ? $params['page'] : 1;
        $all = $this->db->fetchRow($this->db->select(array('COUNT(authorId)' => 'all'))->from('table.contents')->where('table.contents.status = ?', 'publish')->where('table.contents.type=?', 'post'));

        $allpage = ceil($all['all'] / 10);
        $posts = $this->db->fetchAll($this->db->select('table.contents.cid,title,text,views,likes,str_value,created,table.relationships.mid')->from('table.contents')
            ->join('table.fields', 'table.fields.cid = table.contents.cid', Typecho_Db::LEFT_JOIN)
            ->join('table.relationships', 'table.contents.cid = table.relationships.cid', Typecho_Db::LEFT_JOIN)
            ->where('table.fields.name = "thumbSmall"')->where('table.contents.type = ?', 'post')->where('status = ?', 'publish')->where('created < ?', time())->order('table.contents.created', Typecho_Db::SORT_DESC)->offset(($page - 1) * 10)->limit(10));
        $hideRule = self::getHideRule();
        $results = [];
        foreach ($posts as $result) {
            if (is_array($hideRule) && in_array($result['mid'], $hideRule)) continue;
            $result['created'] = date('Y-m-d', $result['created']);
            $result['text'] = mb_substr($result['text'], 15, 20, 'utf-8') . "...";
            $result['link'] = '/pages/detail/detail?cid=' . $result['cid'];
            $results[] = $result;
        }
        $link = [];
        $cover = [];

        $swiper = self::$plugin_config->swiper ? json_decode(self::$plugin_config->swiper, true) : [];
        foreach ($swiper as $key => $wheel) {
            $link[$key] = $wheel['link'];
            $cover[$key] = $wheel['cover'];
        }
        return ['list' => $results, 'allpage' => $allpage, 'page' => $page, 'links' => $link, 'covers' => $cover];
    }

    public function _cate($params)
    {
        $type = isset($params['type']) ? $params['type'] : 'category';

        $all = $this->db->fetchAll($this->db->select('table.metas.mid,table.metas.name')->from('table.metas')->where('table.metas.type=?', $type));
        $items = [];
        $hideRule = self::getHideRule();
        foreach ($all as $one) {
            if (is_array($hideRule) && in_array($one['mid'], $hideRule)) continue;
            $items[] = [
                'text' => $one['name'],
                'id' => $one['mid'],
                'disabled' => false
            ];
        }
        array_unshift($items, ['text' => '全部', 'id' => 0, 'disabled' => false]);
        $cate = isset($params['cate']) ? $params['cate'] : 0;
        $page = isset($params['page']) && !empty($params['page']) ? $params['page'] : 1;
        $queryCount = $this->db->select(array('COUNT(distinct table.contents.cid)' => 'all'))->from('table.contents')
            ->join('table.relationships', 'table.contents.cid = table.relationships.cid', Typecho_Db::INNER_JOIN)
            ->where('table.contents.status = ?', 'publish')->where('table.contents.type=?', 'post');

        $query = $this->db->select('distinct table.contents.cid,title,text,views,likes,str_value,created,table.relationships.mid')->from('table.contents')
            ->join('table.relationships', 'table.contents.cid = table.relationships.cid', Typecho_Db::LEFT_JOIN)
            ->join('table.fields', 'table.fields.cid = table.contents.cid', Typecho_Db::LEFT_JOIN)
            ->where('table.fields.name = "thumbSmall"')
            ->where('table.contents.status = ?', 'publish')
            ->where('table.contents.type=?', 'post');
        if ($cate) {
            $queryCount = $queryCount->where('table.relationships.mid = ?', $cate);
            $query = $query->where('table.relationships.mid = ?', $cate);
        }
        $query = $query->where('table.contents.created < ?', time())->order('table.contents.created', Typecho_Db::SORT_DESC)->offset(($page - 1) * 10)->limit(10);

        $all = $this->db->fetchRow($queryCount);
        $allpage = ceil($all['all'] / 10);
        $cates = $this->db->fetchAll($query);
        $results = [];
        foreach ($cates as $result) {
            if (is_array($hideRule) && in_array($result['mid'], $hideRule)) continue;
            $result['created'] = date('Y-m-d', $result['created']);
            $result['text'] = " ";
            $result['link'] = '/pages/detail/detail?cid=' . $result['cid'];
            $results[] = $result;
        }
        return ['list' => $items, 'page' => $page, 'allpage' => $allpage, 'cate' => $cate, 'cates' => $results];
    }

    public function _tag()
    {
        $all = $this->db->fetchAll($this->db->select('table.metas.mid,table.metas.name')->from('table.metas')->order('table.metas.mid', Typecho_Db::SORT_DESC)->where('table.metas.type=?', 'tag')->offset(0)->limit(200));
        $items = [];
        $color = ['primary', 'success', 'danger', 'warning'];
        $countColor = count($color) - 1;
        foreach ($all as $one) {
            $items[] = [
                'text' => $one['name'],
                'id' => $one['mid'],
                'link' => '/pages/cate/cate?type=tag&cate=' . $one['mid'],
                'type' => $color[rand(0, $countColor)]
            ];
        }
        return ['list' => $items];
    }

    public function _history($params)
    {
        $page = isset($params['page']) && !empty($params['page']) ? $params['page'] : 1;
        $all = $this->db->fetchRow($this->db->select(array('COUNT(authorId)' => 'all'))->from('table.contents')->where('table.contents.type=?', 'post')->where('table.contents.status = ?', 'publish'));
        $allpage = ceil($all['all'] / 10);

        $posts = $this->db->fetchAll($this->db->select('table.contents.cid,title,created')->from('table.contents')->where('table.contents.type = ?', 'post')->where('status = ?', 'publish')->where('created < ?', time())->order('table.contents.created', Typecho_Db::SORT_DESC)->offset(($page - 1) * 10)->limit(20));
        $results = [];
        foreach ($posts as $result) {
            $result['created'] = date('Y-m-d', $result['created']);
            $result['link'] = '/pages/detail/detail?cid=' . $result['cid'];
            $results[] = $result;
        }

        return compact('page', 'allpage', 'results');
    }

    public function _info($params)
    {
        $cid = isset($params['cid']) ? $params['cid'] : 0;
        if (!$cid) exit(0);
        $info = $this->db->fetchRow($this->db->select('table.contents.cid,title,text,views,created,likes,str_value')->from('table.contents')
            ->join('table.fields', 'table.fields.cid = table.contents.cid', Typecho_Db::LEFT_JOIN)
            ->where('table.fields.name = "thumbSmall"')
            ->where('table.contents.cid = ?', $cid));
        $info['created'] = date('Y-m-d', $info['created']);
        $info['footer'] = self::$plugin_config->footer;
        return compact('info');
    }

    public function _me()
    {
        return [
            'avatarUrl' => self::$plugin_config->head,
            'nickName' => self::$plugin_config->name,
            'motto' => self::$plugin_config->motto,
            'website' => self::$plugin_config->website,
            'mail' => self::$plugin_config->mail,
            'copyright' => self::$plugin_config->copyright,
            'footer' => self::$plugin_config->footer,
            'me' => self::$plugin_config->about_me

        ];
    }

    protected static function getHideRule()
    {
        $hide_category = trim(self::$plugin_config->hide_category);
        return explode(',', $hide_category);
    }


    protected function check_agent()
    {
        $agent = $this->request->getAgent();
        $agent = strtolower($agent);
        if (strpos($agent, 'micromessenger') === false) {
            return false;
        }
        return true;
    }

    protected static function get_config(): bool
    {
        if (is_null(self::$plugin_config)) {
            self::$plugin_config = Helper::options()->plugin('WechatTe');
        }
        return true;
    }

    protected function all(): array
    {
        if ($this->request->isGet()) {
            return $_GET;
        } elseif ($this->request->isPost()) {
            return $_POST;
        } else {
            return [];
        }
    }

    protected function check_sign($params): bool
    {
        if (empty($params)) return false;
        if (!isset($params['sign']) || !isset($params['ti'])) return false;
        $sign = $params['sign'];
        unset($params['sign']);
        if ($params['ti'] + 6000 < time()) return false;
        ksort($params);
        $str = '';
        foreach ($params as $key => $param) {
            $str .= $key . '=' . $param . '&';
        }
        $str = rtrim($str, '&');
        if ($sign !== md5(self::$plugin_config->app_secret . $str . self::$plugin_config->app_secret)) {
            return false;
        }
        return true;
    }

    public function action()
    {
        $this->on($this->request);
    }
}
