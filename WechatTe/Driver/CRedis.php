<?php

/**
 * 微信小程序配置对接插件之Redis接口类
 *
 * @package WechatTe
 * @author  友儿
 * @version 3.0.0
 * @link https://niuzheng.net
 */

class CRedis implements ICache
{

    private static $_instance = null;
    private $redis = null;
    private $host = '127.0.0.1';
    private $port = 11211;
    private $expire = 86400;
    private $auth = '';

    private function __construct($option = null)
    {
        $this->host = isset($option->host) && !empty($option->host) ? $option->host : $this->host;
        $this->port = isset($option->port) && !empty($option->port) ? $option->port : $this->port;
        $this->auth = isset($option->auth) && !empty($option->auth) ? $option->auth : $this->auth;
        $this->expire = isset($option->expire) && !empty($option->expire) ? (int)$option->expire : (int)$this->expire;

        $this->init($option);
    }

    static public function getInstance($option)
    {
        if (is_null(self::$_instance) || !isset(self::$_instance)) {
            self::$_instance = new self($option);
        }
        return self::$_instance;
    }

    public function init($option)
    {
        try {
            $this->redis = new Redis();
            $this->redis->connect($this->host, $this->port);
            if (!empty($this->auth)) {
                $this->redis->auth($this->auth);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function add($key, $value, $expire = null)
    {
        return $this->redis->set($key, $value, is_null($expire) ? $this->expire : $expire);
    }

    public function delete($key)
    {
        return $this->redis->delete($key);
    }

    public function set($key, $value, $expire = null)
    {
        return $this->redis->set($key, $value, is_null($expire) ? $this->expire : $expire);
    }

    public function get($key)
    {
        return $this->redis->get($key);
    }

    public function flush()
    {
        return $this->redis->flushDB();
    }
}
