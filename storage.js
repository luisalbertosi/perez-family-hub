
window.PFHStorage={
 TOKEN_KEY:"pfh-google-token-v031",
 getToken(){try{return JSON.parse(localStorage.getItem(this.TOKEN_KEY)||"null")}catch{return null}},
 setToken(accessToken,expiresIn){localStorage.setItem(this.TOKEN_KEY,JSON.stringify({accessToken,expiresAt:Date.now()+Math.max(0,(expiresIn||3600)-60)*1000}))},
 clearToken(){localStorage.removeItem(this.TOKEN_KEY)}
};
