(() => {
  const baseUrl = 'http://192.168.1.2:5244';
  const alistToken = ''; // 这里填alist的token
  const refreshToken = ''; // 这里填阿里云盘的token
  const urls = {
    // 挂载路径: 阿里云分享地址
    '/阿里云分享/北美好莱坞':
      'https://www.aliyundrive.com/s/ZVcrzgkzX1p/folder/61120b1933f13ff60d664b799754e51b9bc62230',
    '/阿里云分享/动作片': 'https://www.aliyundrive.com/s/wLo6c8tHw5a/folder/61120b19bbff1d316be44a059e95a7839bb9e4a5',
    '/阿里云分享/科幻片': 'https://www.aliyundrive.com/s/LyVricYQU7G/folder/61120b0bd087cd2c801f4340b87fb73c00ccc9de',
    '/阿里云分享/豆瓣Top250电影':
      'https://www.aliyundrive.com/s/kKXijJBLtcU/folder/61ffe7f29cb964b1407e41509cfdcc59e8787198',
    '/追番/英雄王': 'https://www.aliyundrive.com/s/tjmwdS5rdPB/folder/63cb914a9956a7b5b7224d3dadf563c5537c90d8',
    '/追番/塔尔萨之王': 'https://www.aliyundrive.com/s/rq321KkyFY1/folder/6370affb53f524530a8d48a58e2e33fe6b2a6636',
    '/追番/想要成为影之实力者':
      'https://www.aliyundrive.com/s/YMaRGKtTbhu/folder/6340495634aa31d460e5410abec851686664d23d',
  };

  const reg = /\/s\/([^/]+)\/folder\/([^/\s]+)/;

  const request = async (data) => {
    const res = await fetch(`${baseUrl}/api/admin/storage/create`, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh,en;q=0.9,zh-CN;q=0.8',
        authorization: alistToken,
        'content-type': 'application/json;charset=UTF-8',
        'proxy-connection': 'keep-alive',
      },
      referrer: `${baseUrl}/@manage/storages/add`,
      referrerPolicy: 'same-origin',
      body: JSON.stringify(data),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const json = await res.json();
    if (json && json.code === 200) {
      console.log(`添加成功 ${json.mount_path}`);
    } else {
      console.log(`添加失败 ${JSON.stringify(json)}`);
    }
    return json;
  };

  const generateParams = ({ path, shareId, rootFolder = 'root' }) => {
    return {
      mount_path: path,
      order: 5,
      remark: '',
      cache_expiration: 30,
      web_proxy: false,
      webdav_policy: '302_redirect',
      down_proxy_url: '',
      extract_folder: '',
      driver: 'AliyundriveShare',
      addition: JSON.stringify({
        refresh_token: refreshToken,
        share_id: shareId,
        share_pwd: '',
        root_folder_id: rootFolder,
        order_by: '',
        order_direction: '',
      }),
    };
  };

  const bodys = Object.keys(urls).map((path) => {
    const link = urls[path];
    const [$0, shareId, rootFolder] = link.match(reg) || [];

    let data = null;

    if (path && shareId) {
      data = generateParams({ path, shareId, rootFolder });
    }

    return data;
  });

  bodys.reduce((promise, body) => {
    return promise.then(async () => {
      console.log(`开始添加 ${body.mount_path}`);
      return await request(body);
    });
  }, Promise.resolve());
})();
