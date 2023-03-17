
// 想搞清楚哪些词条，在或不在 sc.json / tc.json，于是有了此工具
// 也可以反过来搞清楚 sc.json / tc.json 有没有多余的
// 运行：node src/i18nCheck.js

var fs = require("fs");
var path = require("path");

var scDict = { };
var tcDict = { };
var newDict = { };
var scTotal, tcTotal;

var data, data2;
try {
    // 读入 sc.json / tc.json
    data  = fs.readFileSync('./src/assets/i18n/sc.json', 'utf8');
    data2 = fs.readFileSync('./src/assets/i18n/tc.json', 'utf8');
    scDict = JSON.parse(data);
    tcDict = JSON.parse(data2);
    
    for (var key in scDict) {  // 遍历初始化未用
        scDict[key] = 0;
    }
    for (var key in tcDict) {
        tcDict[key] = 0;
    }
} catch (err) {
    console.log(`Error reading file: ${err}`);
}

scTotal = Object.keys(scDict).length;
tcTotal = Object.keys(tcDict).length;

console.log("sc.json Size:", scTotal);
console.log("tc.json Size:", tcTotal);
console.log("---------- ---------- ---------- ");

var dirTotal = 0;  // 目录总数
var fileTotal = 0;  // 文件总数
var htmlTotal = 0;  // html 文件数
var lineTotal = 0;  // html 文件行
var matchTotal = 0;  // 匹配个数
var newTotal = 0;  // 需求个数

function listFile( dir ) {  // 递归遍历目录
	var arr = fs.readdirSync(dir);
	arr.forEach( function(file) {
		var fullpath = path.join(dir, file);
		var stats = fs.statSync(fullpath);
		if ( stats.isDirectory() ) {
            dirTotal ++;
			listFile(fullpath);
		} else {
            fileTotal ++;
            if (path.extname(file).toLowerCase() === '.html') {  // 后缀名 .html
                htmlTotal ++;

                try {  // 读入 html
                    var text = fs.readFileSync(fullpath, 'utf8');
                    var lines = text.split(/\r?\n/);
                    lines.forEach( function(line) {
                        lineTotal ++;
                        // \{ \} \' \" 转义符, \s 空格符
                        // * 零次或多次(任意次), | 或者
                        // g 全局匹配
                        var res  = line.match(/\{\{\s*(\'|\")(.*)(\'|\")\s*\|\s*translate\s*\}\}/);  // {{ 'My store' | translate }}
                        // [
                        //     '{{ "My store" | translate }}',
                        //     '"',
                        //     'My store',
                        //     '"', ...
                        // ]
                        var res2 = line.match(/(\'|\")\s*(\'|\")(.*)(\'|\")\s*\|\s*translate\s*(\'|\")/);  // "'Chain Info' | translate"
                        // [
                        //     `"'My Collections' | translate"`,
                        //     '"',
                        //     "'",
                        //     'My Collections',
                        //     "'",
                        //     '"', ...
                        // ]
                        var key;
                        if (res2 && res2.length > 3) {  // "'Chain Info' | translate"
                            key = res2[3];
                        }
                        if (res && res.length > 3) {  // {{ 'My store' | translate }}
                            key = res[2];
                        }
                        if (key && key.length > 0) {
                            matchTotal ++;
                         // var key = res[2];
                            var tips = "";
                            if (key in scDict) {
                                scDict[key] = 1;  // 使用标志
                            } else {
                                tips += " -> sc.json";
                            }
                            if (key in tcDict) {
                                tcDict[key] = 1;  // 使用标志
                            } else {
                                tips += " -> tc.json";
                            }
                            if (key in newDict) tips = "";  // 已经记录
                            if (tips.length > 0) {
                                newTotal ++;
                                newDict[key] = 1;  // 使用标志
                                console.log('"' + key + '"', tips);
                            }
                        }
                    });
                } catch (err) {
                    console.log(`Error reading file: ${err}`);
                }
            }
        }
	});
}
 
listFile("./src");

console.log("---------- ---------- ---------- ");
console.log("Dir Total:", dirTotal);
console.log("File Total:", fileTotal);
console.log("Html Total:", htmlTotal);
console.log("Html Lines:", lineTotal);
console.log("Match Total:", matchTotal);
console.log("New Total:", newTotal);

console.log("---------- ---------- ---------- ");
console.log("No Use: (sc.json)");
for (var key in scDict) {  // 遍历打印未用的
    if (scDict[key] <= 0) {
        console.log('"' + key + '"');
    }
}
console.log("---------- ---------- ---------- ");
console.log("No Use: (tc.json)");
for (var key in tcDict) {
    if (tcDict[key] <= 0) {
        console.log('"' + key + '"');
    }
}
