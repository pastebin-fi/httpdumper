function copyToClipboard(id, lock) {
    var textBox = document.getElementById(id);
    textBox.select();
    document.execCommand("copy");
}