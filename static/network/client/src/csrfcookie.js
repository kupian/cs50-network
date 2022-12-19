export default function csrfCookie() {
    const csrf_token = document.cookie
        .split(";")
        .find(row => row.startsWith('csrftoken'))
        .split("=")[1];
    return csrf_token;
}