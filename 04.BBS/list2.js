const template = require('./view/maintemplate')

module.exports = {
    mainForm : function(rows){
        let tableRow = '';
        for (let row of rows){
            tableRow += `<tr>
                            <td style="padding-right: 20px">${row.bid}</td>
                            <td style="padding-right: 120px"><a href ="/bbs/bid/${row.bid}">${row.title}</a></td>
                            <td style="padding-right: 30px">${row.uid}</td>
                            <td style="padding-right: 30px">${row.modTime}</td>
                            <td style="padding-right: 30px">${row.viewCount}</td>
                            <td style="padding-right: 90px">
                                <a href = "/update/${row.sid}">수정 </a>
                                <a href = "/bbs/delete/${row.bid}">삭제</a>
                            </td>
                        </tr>`;
        }
        return `
<!DOCTYPE html>
        <html lang="ko">
        <head>
            <title>My BBS</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
            <link rel="stylesheet" href="/fontawesome-free-5.15.1-web/css/all.min.css">
            <script src="/jquery/jquery.min.js"></script>
            <script src="/popper/popper.min.js"></script>
            <script src="/bootstrap/js/bootstrap.min.js"></script>
        </head>
        <body>
        ${template.navBar}


    <div class="container" style="margin-top:90px;">
    </div>
        <div class="container col-10">
            <div class="container">
                <form action = "/insert" method ="post">
                    <table class="table table-hover">
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>닉네임</th>
                            <th>날짜</th>
                            <th>조회수</th>
                            <th>설정</th>
                        </tr>
        ${tableRow}
    </table>
    </form>
        </div>
        <ul class="pagination justify-content-center">
    <li class="page-item"><a class="page-link" href="#"><<</a></li>
    <li class="page-item"><a class="page-link" href="/bbs/list/1">1</a></li>
    <li class="page-item active"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">>></a></li>
        </ul>
        </body>
        </html>
        ${template.footer()};
        `;
    }
}