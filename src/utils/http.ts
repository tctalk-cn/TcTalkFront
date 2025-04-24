import axios, {type AxiosRequestConfig} from "axios";

axios.defaults.timeout = 20 * 1000;
axios.defaults.maxBodyLength = 5 * 1024 * 1024;
axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://127.0.0.1:8000";

axios.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        // 添加 CORS 头部信息
        config.headers['Access-Control-Allow-Origin'] = '*';
        // 读取 localStorage 中的 token
        const profileRaw = localStorage.getItem('userProfile');
        let token = '';
        if (profileRaw) {
            try {
                const profile = JSON.parse(profileRaw);
                token = profile.token || '';
            } catch (e) {
                console.warn('Failed to parse profile from localStorage:', e);
            }
        }
        // config.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
        config.headers['Authorization'] = 'Bearer ' + token;
        config.params = {
            ...config.params,
            t: Date.now(),
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

interface Http {
    get<T>(url: string, params?: unknown): Promise<T>;

    post<T>(url: string, params?: unknown): Promise<T>;

    upload<T>(url: string, params: unknown): Promise<T>;

    put<T>(url: string, params: unknown): Promise<T>;

    delete<T>(url: string, params: unknown): Promise<T>;

    download(url: string): void;
}

const http: Http = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, {params})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    post(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, JSON.stringify(params), {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    },
                )
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    put(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .put(url, JSON.stringify(params))
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    delete(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(url, {params})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    upload(url, file) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, file, {
                    headers: {"Content-Type": "multipart/form-data"},
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    download(url) {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        iframe.onload = function () {
            document.body.removeChild(iframe);
        };

        document.body.appendChild(iframe);
    },
};

export default http;
