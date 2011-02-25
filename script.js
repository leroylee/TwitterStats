function Hash() { }
Hash.prototype = new Object();
Hash.prototype.keys = function () {
    var rv = [];
    for (var n in this)
        if (this.hasOwnProperty(n))
            rv.push(n);
    return rv;
}
Hash.prototype.length = function () {
    return this.keys().length();
}
Hash.prototype.hasKey = function () {
    var has = false;
    var keys = this.keys();
    for (var i in keys) {
        if (arguments[0] == keys[i]) { has = true }
    }
    return has;
}

$(function () {
    var q = "%23mugmc11";
    var start_time = ""; //not used yet
    var end_time = ""; //not used yet
    var sstr = "";
    var nnum = 0;
    var pnum = 1;
    var tweetData = new Hash();
    function testData(d) {
        var empty = false;
        if (d.length < 100) { empty = true; }
        return empty;
    }
    function processData(d) {
        $(d).each(function () {
            if (tweetData.hasKey(this.from_user)) {
                tweetData[this.from_user].push(this);
            }
            else {
                tweetData[this.from_user] = [this];
            }
        });
    }
    function postData() {
        var keys = tweetData.keys();
        var tastr = "<table><tr><th>handle</th><th>#</th></tr>";
        for (var t in keys) {
            tastr += "<tr><td>" + keys[t] + "</td><td>" + tweetData[keys[t]].length + "</td></tr>";
        }
        $("#content").html(tastr + "</table>");
    }

    function getData() {
        if (pnum >= 5) { return null; }
        $.getJSON(
            "http://search.twitter.com/search.json?callback=?&rpp=100&result_type=recent&q=" + q + "&page=" + pnum,
            function (data) {
                var done = false;
                results = data.results;
                done = testData(results);
                if (!done) { processData(results); getData(); }
                else { postData(); }
            }
        );
        ++pnum;
    }
    getData();
});  