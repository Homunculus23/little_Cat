$('.activate_reset').on('click', () => {
    let determine_reset = window.confirm(`
        警告：
        重置后，所有设置将回到默认状态！
        请准备好后按确定以清空本网页Cookie。`);
    if(determine_reset) {
        window.onbeforeunload = () => {
            localStorage.removeItem('x');   //清空网页缓存
        }
        location.reload(); 
    }
})

const $icon_wrapper = $('.icon_wrapper');
const $icon_close = $('.icon_close');
const $add_url = $icon_wrapper.find('.add_url');
const xObject = JSON.parse(localStorage.getItem('x'));  //getItem从localStorage中取出'x'的信息，然后用parse转化为数组
const hashMap = xObject || [
    {
        name: 'MDN中文', url: 'https://developer.mozilla.org', shortcuts: 'm'
    },
    {
        name: '写代码啦', url: 'https://xiedaimala.com', shortcuts: 'x'
    }
]

let removeOfBeginning = (url) => {
    //看了前航视频下，从九行代码改成一行代码，原来replace留下的undefined是这么解决的！
    return url.replace('https://', '').replace('http://', '').replace('www.', '');
}

let render = () => {
    $icon_wrapper.find('.icon_close').remove();
    hashMap.forEach((node, index) => {
        const $icon_Click = $(`
            <div href="${node.url}" class="icon_Click icon_close" title="${node.url}快捷键为: ${node.shortcuts}">
                <span class="icon_icon">${node.name[0]}</span>
                <span class="text">${node.name}</span>
            </div>
        `).insertBefore($add_url);
        $icon_Click.on('click', ()=> {
            window.open(node.url);  //新窗口打开网页
        })
    });
}

render();

$add_url.on('click', () => {
    let url = window.prompt('请粘贴或手动输入网址');
    if(url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    let name = window.prompt('请输入网址名称，不输入则以网址作为名称');
    if(!name) {
        name = removeOfBeginning(url);
    }
    let shortcuts = window.prompt('请输入单字母快捷键，不输入则以网址首字母作为快捷键，快捷键冲突时进入第一个对应网站');
    if(!shortcuts) {
        shortcuts = name[0]
    }
    hashMap.push({
        name: name,
        url: url,
        shortcuts: shortcuts
    });
    render();
})

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap); //将hashMap变为字符串，存入string
    localStorage.setItem('x', string);  //将所有string信息缓存到'x'
}

let number_activate_delete = 0;

$('.activate_delete').on('click', () => {   //40行。。。算了暂时先这样吧
    let delete_confirm;
    if(number_activate_delete%2 === 0) {
        delete_confirm = window.confirm(`
            警告：
            点击×后，将直接移除标签。
            再次点击回收站或刷新网页，退出删除状态。
        `);
        if (delete_confirm) {
            number_activate_delete++;
        }
    }
    if(delete_confirm) {
        $icon_wrapper.find('.icon_close').remove();
        hashMap.forEach((node, index) => {
            const $icon_Click = $(`
                <div href="${node.url}" class="icon_Click icon_close" title="${node.url}快捷键为: ${node.shortcuts}">
                    <span class="icon_icon">${node.name[0]}</span>
                    <span class="text">${node.name}</span>
                    <div class="delete_url icon_${index}">
                        <svg class="icon" style="width:2em; height:2em;">
                            <use xlink:href="#icon-add"></use>
                        </svg>
                    </div>
                </div>
            `).insertBefore($add_url);
            $icon_Click.on('click', '.delete_url', (e) => {
                $(`
                    <span class="delete_victory" style="color: red;font-size: 17px;">
                        删除成功
                    </span>
                `).insertBefore($(`.icon_${index}`));
                hashMap.splice(index, 1);
            })
        });
    }
    $('.activate_delete').on('click', () => {
        location.reload(); 
    })
})

$(document).on('keypress', (e)=>{
    const {key} = e;
    for (let i = 0; i < hashMap.length; i++) {
        if(hashMap[i].shortcuts === key) {
            window.open(hashMap[i].url)
        }
    }
})