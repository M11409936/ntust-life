export const THEME_KEY = "ntustlife.theme";
/** 在 <head> 執行，畫面出現前就套用使用者選的主題，避免閃一下 */
export const themeInitScript = `try{var t=JSON.parse(localStorage.getItem("${THEME_KEY}"));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
