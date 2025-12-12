import { ref, onMounted, onUnmounted } from "vue";
import type { OrderDTO } from "@/models/order.ts";

export function useOrderCountdown(order: OrderDTO, emit: any) {
    const countdownText = ref("");
    const flashing = ref(false);
    const isWarning = ref(false);

    let timer: any;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const expire = new Date(order.expireTime).getTime();
        const diff = expire - now;

        if (diff <= 0) {
            countdownText.value = "已过期";
            flashing.value = false;
            isWarning.value = false;

            // 模拟自动关闭
            order.orderStatus = 6;
            emit("update-status", order);
            clearInterval(timer);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        countdownText.value = `剩余 ${min}分${sec}秒`;

        // 倒数 1 分钟开始闪烁红色
        if (totalSeconds <= 60) {
            flashing.value = true;
            isWarning.value = false;
        } else {
            flashing.value = false;
            isWarning.value = true; // 提前提示
        }
    };

    onMounted(() => {
        updateCountdown();
        timer = setInterval(updateCountdown, 1000);
    });

    onUnmounted(() => clearInterval(timer));

    return { countdownText, flashing, isWarning };
}
