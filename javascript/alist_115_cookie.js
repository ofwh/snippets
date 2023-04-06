(() => {
  const cookies = `PASTE_YOUR_COOKIE_HERE`.split('; ');

  const generateCookie = (() => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const props = {
      expires: expires.toGMTString(),
      domain: '115.com',
      path: '/',
      SameSite: 'None',
      Secure: true,
    };

    const tail = Object.keys(props).reduce((str, key) => {
      const value = props[key];
      const cookie = str ? str + '; ' : '';
      return cookie + (value === true ? key : `${key}=${props[key]}`);
    }, '');

    return (prefix) => {
      return `${prefix}; ${tail}`;
    };
  })();

  cookies.forEach((cookie) => {
    console.log('设置Cookie: ', generateCookie(cookie));
    document.cookie = generateCookie(cookie);
  });
})();
