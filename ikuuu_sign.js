/**
 * ikuuu 多账号自动签到 (带流量详情)
 */
async function start() {
    const data = $persistentStore.read("IKUUU_DATA");
    if (!data) {
        $notification.post("ikuuu 签到跳过", "", "没有找到 Cookie，请重新登录官网抓取");
        return $done();
    }

    const accounts = JSON.parse(data);
    let summary = [];

    for (let email in accounts) {
        const resMsg = await new Promise((resolve) => {
            $httpClient.post({
                url: 'https://ikuuu.win/user/checkin',
                headers: {
                    'Cookie': accounts[email],
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15',
                    'Referer': 'https://ikuuu.win/user',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }, (err, resp, body) => {
                if (err) return resolve("请求失败 ❌");
                try {
                    const obj = JSON.parse(body);
                    resolve(obj.msg); // res.msg 包含：获得了 1024MB 流量
                } catch (e) { resolve("解析错误 ⚠️"); }
            });
        });
        summary.push(`- ${email}: ${resMsg}`);
    }

    $notification.post("ikuuu 每日签到总结", `账号总数: ${summary.length}`, summary.join("\n"));
    $done();
}
start();
