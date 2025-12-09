<template>
  <div class="protocol-page">
    <van-nav-bar title="会员服务协议" left-arrow @click-left="$router.back()" />

    <div class="content">
      <h2 id="1">一、服务说明</h2>
      <p>本协议是用户与本平台之间关于会员服务的使用协议。</p>

      <h2 id="2">二、会员权益</h2>
      <p>会员在有效期内可以享受包括但不限于以下权益：</p>
      <ul>
        <li>专属内容特权</li>
        <li>评论优先展示</li>
        <li>免广告特权</li>
      </ul>

      <h2 id="3">三、自动续费规则</h2>
      <p>
        为了确保服务不间断，本服务支持自动续费。
        若用户未主动取消，则系统会在扣费周期到达前自动扣费。
      </p>

      <h3 id="3-1">1. 扣费时间</h3>
      <p>到期前 24 小时发起扣款。</p>

      <h3 id="3-2">2. 扣费方式</h3>
      <p>扣费路径为用户当前绑定的支付渠道。</p>

      <h2 id="4">四、退款规则</h2>
      <p>会员服务为虚拟商品，一经开通不支持退款。</p>

      <h2 id="5">五、其他</h2>
      <p>若用户违反平台规则，平台有权终止会员资格。</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.protocol-page {
  background: #fff;
  min-height: 100vh;

  .content {
    padding: 16px;
    color: #333;
    font-size: 14px;
    line-height: 1.6;

    h2 {
      font-size: 17px;
      font-weight: 600;
      margin-top: 20px;
    }

    h3 {
      font-size: 15px;
      font-weight: 600;
      margin-top: 12px;
    }

    ul {
      padding-left: 18px;
      list-style: disc;
    }
  }
}
</style>
