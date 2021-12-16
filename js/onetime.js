const formURL = document.forms.form.url;
const formPath = document.forms.form.path;
const formSecret = document.forms.form.secret;
const formDateTime = document.forms.form.datetime;

const pad = (number) => {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

const generateURL = () => {
  // JSTを取得
  let now = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  // 有効期限が指定されていない場合は1時間後を指定
  if (!formDateTime.value) {
    now.setHours(now.getHours() +1);
    formDateTime.value = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + "T" + pad(now.getHours()) + ":" + pad(now.getMinutes());
  }
  // 有効期限を取得
  let date = new Date(formDateTime.value).getTime() / 1000;
  // ベースURLの末尾が/の場合は削除 
  let url = formURL.value
  while (url.endsWith('/')) {
    url = url.slice(0,-1);
  }
  // ファイルパスが/から始まっていない場合は追加
  if (!formPath.value.startsWith("/")) {
    formPath.value = "/" + formPath.value
  }

  // EPOCHのHEXを作成
  let time = date.toString(16);
  // MD5を作成
  let md5base = "/" + formPath.value + "/" + formSecret.value + "/" + time + "/";
  console.log(md5base);
  let md5 = CybozuLabs.MD5.calc(md5base);

  // URLを出力
  let output  = document.getElementById('output_url');
  url = url + formPath.value + "?webaccel_secure_time=" + time + "&webaccel_secure_hash=" + md5;
  output.textContent = url;
}

formURL.addEventListener('input',()=>{generateURL();})
formPath.addEventListener('input',()=>{generateURL();})
formSecret.addEventListener('input',()=>{generateURL();})
formDateTime.addEventListener('input',()=>{generateURL();})
