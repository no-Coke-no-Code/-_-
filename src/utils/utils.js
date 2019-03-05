const _ = {
    // deletin:用于删除字符串中想要删除的字符串段
    //target为目标字符串  str为所想要删掉的字符串    n为序号；
    deleting:function(target1,str1,n1){
        let target = target1;
        let str = str1;
        let n = n1;

        if(typeof target == Number)
        {
            target = target.toString();
        }
        if(typeof str == Number)
        {
            str = str.toString();
        }

        if(!str)
        {
            return "warning!!str should be string";
        }
        else
        {
            let responseArr = [];
            let responseIndex = [];
            let regExp = eval("/"+str+"/g");
            while(regExp.exec(target) != null)
            {
                if(!!regExp.lastIndex)
                {
                    responseIndex.push(regExp.lastIndex);
                }
            }
            // 若需要删除的索引是正数，则正序的第几个匹配项
            // 减去匹配字符串长度是因为字符串的长度不确定，所以将目标字符串拆分为数组之后
            // responseIndex[n-1]-str.length为匹配字符串的第一位
            // str.length为匹配字符串的长度 
            if(n <= responseIndex.length && n > 0)
            {
                responseArr = target.split("");
                responseArr.splice(responseIndex[n-1]-str.length,str.length);
                responseArr = responseArr.join("");
            }
            // 若索引为负数，则为逆序的第几个匹配项
            else if(Math.abs(n) <= responseIndex.length && n < 0)
            {
                responseArr = target.split("");
                responseArr.splice(responseIndex[responseIndex.length-Math.abs(n)]-str.length,str.length);
                responseArr = responseArr.join("");
            }
            // 若不输入索引，则删除所有匹配项
            else if(!n)
            {
                let regExp = eval("/" + str + "/g");
                responseArr = target.replace(regExp,"");
            }
            return responseArr;
        }
    },
};

module.exports = _;