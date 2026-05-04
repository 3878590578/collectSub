/**
 * ikuuu 碎块合并抓取脚本
 */
const headers = $response.headers;
const setCookie = headers['Set-Cookie'] || headers['set-cookie'];

if (setCookie) {
    let cookieStr = "";
    if (Array.isArray(setCookie)) {
        cookieStr = setCookie.map(c => c.split(';')[0]).join('; ');
    } else {
        cookieStr = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
    }

    if (cookieStr.includes("key=") && cookieStr.includes("uid=")) {
        const emailMatch = cookieStr.match(/email=([^;]+)/);
        const account = emailMatch ? decodeURIComponent(emailMatch[1]) : "默认账号";

        let accounts = JSON.parse($persistentStore.read("IKUUU_DATA") || "{}");
        accounts[account] = cookieStr;

        if ($persistentStore.write(JSON.stringify(accounts), "IKUUU_DATA")) {
            $notification.post("ikuuu 抓包成功", `账号: ${account}`, "所有 Cookie 碎块已合并保存");
        }
    }
}
$done({});
