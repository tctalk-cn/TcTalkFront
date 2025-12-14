import { ref, onMounted, onUnmounted, computed } from "vue";
import type { OrderDTO } from "@/models/order.ts";

export function useOrderCountdown(order: OrderDTO) {
    const countdownText = ref("");
    const flashing = ref(false);
    const isWarning = ref(false);

    let timer: number | undefined;

    // 是否允许倒计时（⚠️ 核心保护）
    const canCountdown = computed(() => {
        return (
            [0, 1].includes(order.orderStatus) &&        // 仅创建 / 待支付
            !!order.expireTime
        );
    });

    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = undefined;
        }
        flashing.value = false;
        isWarning.value = false;
    };

    const updateCountdown = () => {
        if (!canCountdown.value) {
            stop();
            countdownText.value = "";
            return;
        }

        const now = Date.now();
        const expire = new Date(order.expireTime!).getTime();
        const diff = expire - now;

        // 已过期（❌ 不改 order）
        if (diff <= 0) {
            countdownText.value = "已过期";
            stop();
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;

        countdownText.value = `${min.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}`;

        // 状态提示
        if (totalSeconds <= 60) {
            flashing.value = true;
            isWarning.value = false;
        } else {
            flashing.value = false;
            isWarning.value = true;
        }
    };

    onMounted(() => {
        updateCountdown();
        if (canCountdown.value) {
            timer = window.setInterval(updateCountdown, 1000);
        }
    });

    onUnmounted(() => stop());

    return {
        countdownText,
        flashing,
        isWarning,
    };
}
