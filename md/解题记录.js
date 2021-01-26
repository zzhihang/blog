/*假设你是一个好爸爸（妈妈），你想给你的孩子们分一些饼干。每个孩子只能得到一块饼干，但每个孩子想要的饼干大小不尽相同。你的目标就是尽量让更多的孩子满意。*/


// 如果孩子的要求是 [1, 3, 5, 4, 2]，饼干是[1, 1]，最多能让1个孩子满足。
// 如果孩子的要求是 [10, 9, 8, 7, 6]，饼干是[7, 6, 5]，最多能让2个孩子满足。
const fenbinggan = function (childList, bingGanList) {
    const sort = function (a, b) {
        return a - b;
    };
    bingGanList.sort(sort);
    childList.sort(sort);
    let i = 0;
    for(let j = 0; i < childList.length && j < bingGanList.length; j++){
        if(childList[i] <= bingGanList[j]){
            i++
        }
    }
    return i;
};

console.log(fenbinggan([10, 9, 8, 7, 6], [7, 6, 5]))
