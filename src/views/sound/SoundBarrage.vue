<template>
  <div style="position:relative;width: 100%;height: 100%;overflow:hidden" ref="barrageRef"/>
</template>
<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {getTransitionEndName} from "@/utils/compatible.ts";
import {BarrageType} from "@/models/barrage.ts";
import {defineExpose} from "vue";


interface BarrageData {
  type: BarrageType;
  color: string;
  content: string;
}

const props = defineProps<{
  fontSize?: string;
  opacity?: number;
  barrages?: BarrageData[];
}>();

const barrageRef = ref<HTMLDivElement>();

let viewWidth: number = 0;
let viewHeight: number = 0;
let contentHeight: number = 0;
let randomTop: number = 0;
let fixedTop: number = 0;
let fontSize: string = "0.8rem";
let opacity: number = 1;
onMounted(() => {
  init();
});

onUnmounted(() => {
  clear();
})

const init = () => {
  refresh();
  const div = document.createElement('div');
  div.innerHTML = "div";
  div.style.fontStyle = fontSize;

  const body = document.getElementsByTagName("body")[0];
  body.appendChild(div);
  // 弹幕内容高度
  contentHeight = 4 * div.offsetHeight;
  body.removeChild(div);
  if (props.barrages) {
    for (const barrage of props.barrages) {
      send(barrage);
    }
  }
}

/**
 * 发送弹幕
 */
const send = (barrage: BarrageData) => {
  const barrageDOM = barrageRef.value;
  const barrageElem = createBarrageElem(barrage);
  barrageDOM.appendChild(barrageElem);
  if (barrage.type !== BarrageType.FIXED) {
    const x = -(viewWidth + barrageElem.offsetWidth);
    setTimeout(() => {
      barrageElem.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
      barrageElem.style.transform = `translate3d(${x}px, 0, 0)`;
    }, 10);
  } else {
    barrageElem.style.left = (viewWidth - barrageElem.offsetWidth) / 2 + "px";
    // 移除弹幕
    setTimeout(() => {
      if (barrageElem.parentNode === barrageDOM) {
        barrageDOM.removeChild(barrageElem);

        // 距顶端位置减少一个弹幕内容高度
        fixedTop -= contentHeight;
        if (fixedTop < 0) {
          fixedTop = 0;
        }
      }
    }, 5000);
  }
}

const clear = () => {
  randomTop = 0;
  fixedTop = 0;
  const barrageDOM = barrageRef.value;
  const children = barrageDOM?.children;
  if (children != null) {
    for (const child of Array.from(children)) {
      barrageDOM.removeChild(child);
    }
  }
}

/**
 * 创建弹幕元素
 */
const createBarrageElem = (barrage: BarrageData) => {
  const div = document.createElement("div");
  div.innerHTML = barrage.content;

  const style: any = {
    position: "absolute",
    fontFamily: "黑体",
    fontSize: "0.8rem",
    fontWeight: "bold",
    whiteSpace: "pre",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)", // 黑色阴影
    color: barrage.color,
    opacity: opacity
  };
  // 随机滚动
  if (barrage.type !== BarrageType.FIXED) {
    const transitionName = getTransitionEndName(div);
    const handleTransitionEnd = () => {
      // 弹幕运动完成后移除监听，清除弹幕
      div.removeEventListener(transitionName, handleTransitionEnd);
      barrageRef.value.removeChild(div);

      // 距顶端位置减少一个弹幕内容高度
      randomTop -= contentHeight;
      // 最小值边界判断
      if (randomTop < 0) {
        randomTop = 0;
      }
    };
    div.addEventListener(transitionName, handleTransitionEnd);
    // 距离顶端位置增加一个弹幕内容高度，防止滚动弹幕重叠
    randomTop += contentHeight;
    // 最大值边界判断
    if (randomTop > viewHeight - contentHeight) {
      randomTop = 0;
    }

    style.top = `${randomTop}px`;
    style.left = `${viewWidth}px`;
    style.webkitTransition = "-webkit-transform 5s linear 0s";
    style.transition = "transform 5s linear 0s";
  } else {
    // 距离顶端位置增加一个弹幕内容高度，防止固定弹幕重叠
    fixedTop += contentHeight;
    // 最大值边界判断
    if (fixedTop > viewHeight - contentHeight) {
      fixedTop = 0;
    }
    div.style.top = fixedTop + "px";
  }
  for (const k in style) {
    if (style[k] !== void 0) {
      div.style[k] = style[k];
    }
  }

  return div;
}


/**
 * 刷新弹幕容器宽高
 */
const refresh = () => {
  const barrageDOM = barrageRef.value;
  // 弹幕区域宽
  viewWidth = barrageDOM.offsetWidth;
  // 弹幕区域高
  viewHeight = barrageDOM.offsetHeight;
}

// 在组件的底部添加以下代码
defineExpose({
  send: send,
  clear: clear
});
</script>
