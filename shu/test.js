const canvas_options = {
    canvasWidth: 750,
    canvasHeight: 800,
    chartZone: [70, 70, 750, 570], //坐标绘制区域
    yAxisLabel: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],//y轴坐标text
    yAxisLabelWidth: 70,//y轴最大宽度
    yAxisLabelMax: 100,//y轴最大值
    middleLine: 410, //中间线
    pillarWidth: 10,//柱子宽度
    distanceBetween: 50,//柱状图绘制区域距离两边间隙
    pillar: [120, 70, 700, 750],//柱状图绘制区域
    mainTrunkHeight: 90,//底部开始主干高度
    dialogWidth: 300,//弹窗宽度
    dialogLineHeight: 30,//弹窗高度
    dialogDrawLineMax: 4,
}
const nodeClick = [];
var chooseNode = null;
const datalist = {
    showDataInfo: {
        city: [
            {
                name: '项目1',
                status: 1, //状态：0已完成 1进行中
                node: [
                    { value: 10, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 20, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                ]
            },
            {
                name: '项目2',
                status: 0, //状态：0已完成 1进行中
                node: [
                    { value: 10, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 50, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 100, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                ]
            },
            {
                name: '项目3',
                status: 1, //状态：0已完成 1进行中
                node: [
                    { value: 20, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 30, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 40, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                ]
            },
            {
                name: '项目4',
                status: 1, //状态：0已完成 1进行中
                node: [
                    { value: 20, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                    { value: 30, date: '2020-03-12 15:50:02', content: '用于组织信息和操作，通常也作为详细信息的入口。' },
                ]
            },
        ]
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
ctx.save();

drawYLabel(canvas_options, ctx); //绘制y轴坐标
drawStartButton(ctx, canvas_options);
drawData(ctx, datalist.showDataInfo, canvas_options);

canvas.addEventListener("click", event => {
    //清除之前的弹窗
    if (chooseNode != null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        drawYLabel(canvas_options, ctx); //绘制y轴坐标
        drawStartButton(ctx, canvas_options);
        drawData(ctx, datalist.showDataInfo, canvas_options);
        chooseNode = null
    }
    //判断点击节点
    let rect = canvas.getBoundingClientRect();
    let zoom = rect.width / canvas_options.canvasWidth;
    let x = (event.clientX / zoom - rect.left / zoom).toFixed(2);
    let y = (event.clientY / zoom - rect.top / zoom).toFixed(2);

    for (var t = 0; t < nodeClick.length; t++) {
        ctx.beginPath();
        ctx.arc(nodeClick[t].x, nodeClick[t].y, 15, 0, Math.PI * 2, true);
        if (ctx.isPointInPath(x, y)) {
            textPrewrap(ctx, `备注描述：${nodeClick[t].date}`, nodeClick[t].x + 20, nodeClick[t].y + 20, canvas_options.dialogWidth - 40);
            ctx.restore();
            chooseNode = t
            break;
        } else {
            chooseNode = null
        }
    }
});

//content：需要绘制的文本内容; drawX：绘制文本的x坐标; drawY：绘制文本的y坐标;
//lineMaxWidth：每行文本的最大宽度
function textPrewrap(ctx, content, drawX, drawY, lineMaxWidth) {
    var drawTxt = ''; //当前绘制的内容
    var drawLine = 1;//第几行开始绘制
    var drawIndex = 0;//当前绘制内容的索引
    //判断内容是够可以一行绘制完毕
    if (ctx.measureText(content).width <= lineMaxWidth) {
        drawDialog(ctx, canvas_options.dialogWidth, canvas_options.dialogLineHeight, drawX, drawY);
        ctx.fillText(content.substring(drawIndex, i), drawX.drawY);
    } else {
        for (var i = 0; i < content.length; i++) {
            drawTxt += content[i];
            if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
                drawDialog(ctx, canvas_options.dialogWidth, canvas_options.dialogLineHeight, drawX, drawY);
                ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
                drawIndex = i + 1;
                drawLine += 1;
                //drawY+=lineHeight;
                drawTxt = '';
            } else {
                //内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
                if (i === content.length - 1) {
                    drawDialog(ctx, canvas_options.dialogWidth, canvas_options.dialogLineHeight, drawX, drawY);
                    ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY)
                }
            }
        }
    }
}

function drawDialog(ctx, width, height, x, y) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(x, y, width, height);
    ctx.font = "22px ''";
    ctx.fillStyle = "#fff";
    ctx.textAlign = 'left';
    ctx.textBaseline = "top";
}

//绘制y轴坐标
function drawYLabel(options, ctx) {
    let labels = options.yAxisLabel;
    let yLength = (options.chartZone[3] - options.chartZone[1]) * 0.98;
    let gap = yLength / (labels.length - 1);

    labels.forEach((item, index) => {
        //绘制圆角背景
        //this.radiusButton(ctx,0,options.chartZone[3]-index*gap-13,50,24,8,"#313947");

        //绘制坐标文字
        ctx.beginPath();
        ctx.fillStyle = "#878787";
        ctx.font = "18px ''";
        ctx.textAlign = "center";
        ctx.fillText(item, 25, options.chartZone[3] - index * gap + 5);
        //绘制辅助线
        ctx.beginPath();
        ctx.strokeStyle = "#eaeaea";
        ctx.strokeWidth = 2;
        ctx.moveTo(options.chartZone[0], options.chartZone[3] - index * gap);
        ctx.lineTo(options.chartZone[2], options.chartZone[3] - index * gap);
        ctx.stroke();
    })

}
//绘制开始按钮
function drawStartButton(ctx, options) {
    //绘制按钮图形
    this.radiusButton(ctx, options.middleLine - (160 / 2), options.canvasHeight - 50, 160, 50, 8, '#F4C63D');
    ctx.fillStyle = "#fff";
    ctx.font = "24px ''";
    ctx.textAlign = "center";
    ctx.fillText('开始', options.middleLine, options.canvasHeight - 15);

    //绘制状态
    ctx.beginPath();
    ctx.fillStyle = "#333";
    ctx.font = "24px ''";
    ctx.textAlign = "left";
    ctx.fillText("已完成", 0, options.canvasHeight - 100);
    ctx.fillText("进行中", 0, options.canvasHeight - 50);
    //绘制红色按钮
    ctx.beginPath();
    ctx.fillStyle = "#d35453";
    ctx.arc(options.chartZone[0] + 30, options.canvasHeight - 100 - 7, 8, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#d35453";
    ctx.arc(options.chartZone[0] + 30, options.canvasHeight - 100 - 7, 14, 0, 2 * Math.PI, true);
    ctx.stroke();
    //绘制蓝色按钮
    ctx.beginPath();
    ctx.fillStyle = "#24b99a";
    ctx.arc(options.chartZone[0] + 30, options.canvasHeight - 50 - 8, 8, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#24b99a";
    ctx.arc(options.chartZone[0] + 30, options.canvasHeight - 50 - 8, 14, 0, 2 * Math.PI, true);
    ctx.stroke();

}
//封装绘制圆角矩形函数
function radiusButton(ctx, x, y, width, height, radius, color_back) {
    ctx.beginPath();
    ctx.fillStyle = color_back
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fill()
}
//绘制数据
function drawData(ctx, data, options) {

    //const paths=[];
    let number = data.city.length;
    //绘制矩形
    data.city.forEach((item, index) => {
        let indexVal = number == 1 ? 1 : index;
        let numberVal = number == 1 ? 2 : number - 1
        let x0 = options.chartZone[0] + options.distanceBetween + (options.chartZone[2] - options.chartZone[0] - options.distanceBetween * 2) / numberVal * indexVal;
        let value = item.node[item.node.length - 1].value;
        let height = (value / options.yAxisLabelMax * (options.chartZone[3] - options.chartZone[0]) * 0.98).toFixed(2);
        let y0 = options.chartZone[3] - height;

        //柱状图底部
        ctx.beginPath();
        ctx.fillStyle = '#eee';
        ctx.fillRect(x0 - 5, 80, options.pillarWidth, options.chartZone[3] - 80);

        //贝塞尔曲线
        ctx.beginPath();

        ctx.strokeStyle = item.status == 0 ? "#d35453" : '#24b99a';
        ctx.lineWidth = options.pillarWidth;
        ctx.moveTo(options.middleLine, options.pillar[3]); //贝塞尔曲线起始点
        ctx.lineTo(options.middleLine, options.canvasHeight - 50 - options.mainTrunkHeight); //贝塞尔曲线中间竖线
        ctx.quadraticCurveTo(x0, options.canvasHeight - 50 - options.mainTrunkHeight, x0, options.chartZone[3]);
        //绘制柱状图进度
        ctx.lineTo(x0, y0);
        ctx.stroke();

        //绘制文字
        ctx.font = "28px ''";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#333";
        ctx.fillText(item.name, x0, options.chartZone[1] - 20);

        //绘制节点
        item.node.forEach((node_item, node_index) => {
            let y1 = options.chartZone[3] - (node_item.value / options.yAxisLabelMax * (options.chartZone[3] - options.chartZone[0]) * 0.98).toFixed(2);
            ctx.beginPath();
            ctx.arc(x0, y1, 15, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgba(108,212,148,1)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x0, y1, 9, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.fill();
            const pointInfo = {
                x: x0,
                y: y1,
                date: node_item.data,
                content: node_item.content,
                value: node_item.value
            };
            nodeClick.push(pointInfo);
        })
    })
}