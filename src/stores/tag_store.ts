import {defineStore} from "pinia";
import {useListTags} from "@/api/category/tag_api";


// TagStore
export const useTagStore = defineStore({
    id: "tag",
    state: () => {
        return {
            tags: [],
        }
    },
    actions: {
        // 获取标签
        listTags() {
            this.tags = [];
            useListTags(1, 5).then(result => {
                let tags = result.data.list;
                for (let index = 0; index < tags.length; index++) {
                    this.tags.push(tags[index].name);
                }
            });
        }
    }
});