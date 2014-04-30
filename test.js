function write(filename, data, callback) {
    fs.writeFile(filename, data, function(err) {
        if (err) {
            callback(err);
            // returnを忘れた。。
            // これではcallbackが二回実行されてしまう。。
        }
        callback();
    });
}
