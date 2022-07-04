<?php

/**
 * 微信小程序配置对接插件之Cache接口类
 *
 * @package WechatTe
 * @author  友儿
 * @version 3.0.0
 * @link https://niuzheng.net
 */

interface ICache
{
    public function init($option);

    public function add($key, $value, $expire = null);

    public function delete($key);

    public function set($key, $value, $expire = null);

    public function get($key);

    public function flush();
}
