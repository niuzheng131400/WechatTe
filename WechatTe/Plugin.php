<?php

/**
 * 微信小程序配置对接插件之WechatTe_Plugin接口类
 *
 * @package WechatTe
 * @author  友儿
 * @version 3.0.0
 * @link https://niuzheng.net
 */


if (!defined('__TYPECHO_ROOT_DIR__')) exit;

/**
 * 微信小程序配置对接插件
 *
 * @package WechatTe
 * @author  友儿
 * @version 3.0.0
 * @link https://niuzheng.net
 */
class WechatTe_Plugin implements Typecho_Plugin_Interface
{
    public static function activate()
    {
        Helper::addRoute('jsonp', '/wxapi/v1/g.c', 'WechatTe_Action');
        Helper::addAction('json', 'WechatTe_Action');
        self::init();
    }

    private static function init()
    {
        $db     = Typecho_Db::get();
        $prefix = $db->getPrefix();
        if (!array_key_exists('views', $db->fetchRow($db->select()->from('table.contents')))) {
            $db->query('ALTER TABLE `' . $prefix . 'contents` ADD `views` INT(10) DEFAULT 0;');
        }
        if (!array_key_exists('likes', $db->fetchRow($db->select()->from('table.contents')))) {
            $db->query('ALTER TABLE `' . $prefix . 'contents` ADD `likes` INT(10) DEFAULT 0;');
        }
    }

    public static function deactivate()
    {
        Helper::removeRoute('jsonp');
        Helper::removeAction('json');
    }

    public static function config(Typecho_Widget_Helper_Form $form)
    {
        $default_swiper = '[{"link":"/pages/cate/cate?cate=361","cover":"https://img.xxxxx.net/usr/uploads/2020/09/2185816269.png"},{"link":"/pages/cate/cate?cate=363","cover":"https://img.xxxxx.net/usr/uploads/2020/09/573794959.jpg"},{"link":"/pages/cate/cate?cate=2","cover":"https://img.xxxxx.net/usr/uploads/images/php-default.jpg"},{"link":"/pages/cate/cate?cate=49","cover":"https:/xxxx.net/usr/uploads/images/xiaojiqiao.jpeg"}]';
        $swiper = new Typecho_Widget_Helper_Form_Element_Textarea('swiper', NULL, $default_swiper, _t('首页轮播图'), _t('url里面的cate为分类的mid'));
        $form->addInput($swiper);
		
		$hide_category = new Typecho_Widget_Helper_Form_Element_Text('hide_category', NULL, '', _t('隐藏分类ID'), _t('多个分类ID以英文逗号分隔,用于小程序分类列表'));

        $form->addInput($hide_category);

        $app_secret = new Typecho_Widget_Helper_Form_Element_Text('app_secret', NULL, 'xxx', _t('api密钥'), _t('要与小程序端/helpers/md5.js中app_secret字段保持一致，否则无法从服务器读取数据'));

        $form->addInput($app_secret);

        $head = new Typecho_Widget_Helper_Form_Element_Text('head', NULL, 'https://xxxxx.net/usr/themes/handsome/assets/img/photos/headportrait.jpg', _t('个人中心头图'), _t('个人中心头图'));
        $form->addInput($head);

        $name = new Typecho_Widget_Helper_Form_Element_Text('name', NULL, '友儿', _t('个人中心名称'), _t('小个人中心名称'));
        $form->addInput($name);

        $about_me = new Typecho_Widget_Helper_Form_Element_Textarea('about_me', NULL, '一名普通的程序员', _t('关于我'), _t('个人中心关于我'));
        $form->addInput($about_me);

        $motto = new Typecho_Widget_Helper_Form_Element_Text('motto', NULL, '让程序创造人生 ，让学习成为一种习惯。', _t('座右铭'), _t('个人中心座右铭'));
        $form->addInput($motto);

        $website = new Typecho_Widget_Helper_Form_Element_Text('website', NULL, 'https://xxxxx.net', _t('博客地址'), _t('个人中心博客地址'));
        $form->addInput($website);

        $mail = new Typecho_Widget_Helper_Form_Element_Text('mail', NULL, '7710xxx48#qq.com', _t('个人中心邮箱'), _t('小程序个人中心邮箱'));
        $form->addInput($mail);


        $copyright = new Typecho_Widget_Helper_Form_Element_Text('copyright', NULL, '本站除注明原创外，其他内容均来源于网络收集，如有侵权，请邮件告知我并删除。', _t('个人中心版权'), _t('小程序个人中版权'));
        $form->addInput($copyright);


        $footer = new Typecho_Widget_Helper_Form_Element_Text('footer', NULL, '友儿屋', _t('小程序底部版权'), _t('小程序底部版权'));
        $form->addInput($footer);

        $cachetime = new Typecho_Widget_Helper_Form_Element_Text('cachetime', NULL, '86400', _t('缓存过期时间'), _t('86400 = 60s * 60m *24h，即一天的秒数'));
        $form->addInput($cachetime);

        $list = array(
            '0' => '不使用缓存',
            'CMemcached' => 'Memcached',
            'CMemcache' => 'Memcache',
            'CRedis' => 'Redis'
        );
        $element = new Typecho_Widget_Helper_Form_Element_Radio('cache_driver', $list, '0', '缓存驱动', '缓存驱动');
        $form->addInput($element);

        $element = new Typecho_Widget_Helper_Form_Element_Text('host', null, '127.0.0.1', '主机地址', '主机地址，一般为127.0.0.1');
        $form->addInput($element);

        $element = new Typecho_Widget_Helper_Form_Element_Text('port', null, '11211', '端口号', '端口号，memcache对应11211，Redis对应6379，其他类型随意填写');
        $form->addInput($element);

        $element = new Typecho_Widget_Helper_Form_Element_Text('auth', null, '', '连接密码', '连接密码，没有则不填');
        $form->addInput($element);

        $isclear = new Typecho_Widget_Helper_Form_Element_Radio('isclear', array('0' => '否', '1' => '清除'), '0', _t('是否清除当前缓存'), _t('是否清除当前缓存'));
        $form->addInput($isclear);
    }

    public static function configHandle($config)
    {
        if ($config['cache_driver'] != '0') {
            $driver_name = $config['cache_driver'];
            $file_path = "Driver/$driver_name.php";
            require_once 'Driver/ICache.php';
            require_once $file_path;
            $cache_config = new stdClass();
            $cache_config->host = $config['host'];
            $cache_config->port = $config['port'];
            $cache_config->auth = $config['auth'];
            $cache_config->expire = $config['cachetime'];
            try {
                if ($config['isclear'] == '1') call_user_func(array($driver_name, 'getInstance'), $cache_config)->flush();
            } catch (Exception $e) {
                print $e->getMessage();
                exit();
            }
            $config['isclear'] = '0';
        }
        Helper::configPlugin('WechatTe', $config);
    }

    public static function personalConfig(Typecho_Widget_Helper_Form $form){}

    public static function render(){}
}
