const fs = require('fs');
const mysql = require('mysql');
let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);

module.exports = {
    getConnection : function(){
        let conn = mysql.createConnection({
            host : config.host,
            user : config.user,
            password : config.password, // github에 올릴 때 password가 올라가기 때문에 처리해야함.
            database : config.database,
            port : config.port
        });
        conn.connect(function(error) {
            if(error) 
                console.log('mysql connection error : ' +error);
            });
            return conn;
        },
        getAllLists: function(callback){
    let sql = `CREATE TABLE if not exists users(
        uid VARCHAR(20) NOT NULL PRIMARY KEY,
        pwd CHAR(44) NOT null,
        uname VARCHAR(20) NOT null,
        tel varchar(20),
        email varchar(40),
        regDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        isDeleted INT DEFAULT 0 
        );
    `;
    let conn = this.getConnection();
    conn.query(sql, (error, fields) =>{
        if(error)
            console.log(error);
    });
    conn.end();
},

    getBbsList:     function(offset, callback) {
        let conn = this.getConnection();
        let sql = `SELECT b.bid, b.uid, u.uname, b.title, b.content, 
                    b.modTime, b.viewCount, b.replyCount
                    FROM bbs AS b
                    JOIN users AS u
                    ON b.uid=u.uid
                    WHERE b.isDeleted=0
                    ORDER BY b.bid DESC 
                    LIMIT 10 offset ?;`;
        conn.query(sql, offset, (error, rows, fields) => {
            if (error)
                console.log(error);
            callback(rows);
        });
        conn.end();
    },

    getBbsTotalCount:     function(callback) {
        let conn = this.getConnection();
        let sql = `SELECT count(*) as count FROM bbs where isDeleted=0;`;
        conn.query(sql, (error, results, fields) => {
            if (error)
                console.log(error);
            callback(results[0]);   // 주의할 것
        });
        conn.end();
    },
    


/*         getAllList:    function(callback) {
            let conn = this.getConnection();
            let sql = `SELECT bid, title, uid, date_format(modTime, '%Y-%m-%d %T') AS modTime, viewCount FROM bbs WHERE isDeleted=0 ORDER BY bid DESC LIMIT 10`;
            conn.query(sql, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback(rows);
            });
            conn.end();
        },

        getnextList:    function(callback) {
            let conn = this.getConnection();
            let sql = `SELECT bid, title, uid, date_format(modTime, '%Y-%m-%d %T') AS modTime, viewCount FROM bbs WHERE isDeleted=0 ORDER BY bid asc LIMIT 10 offset 0`;
            conn.query(sql, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback(rows);
            });
            conn.end();
        },
        */
            getReplyData:     function(bid, callback) {
                let conn = this.getConnection();
                let sql = `SELECT r.rid, r.bid, r.uid, u.uname, r.content, r.isMine,
                            DATE_FORMAT(r.regTime, '%Y-%m-%d %T') as regTime
                            FROM reply AS r
                            JOIN users AS u
                            ON r.uid = u.uid
                            WHERE r.bid=?;`;
                conn.query(sql, bid, (error, rows, fields) => {
                    if (error)
                        console.log(error);
                    callback(rows);
                });
                conn.end();
            },

        getContents:    function(bid, callback) {
            let conn = this.getConnection();
            let sql = `SELECT bid, title, uid, date_format(modTime, '%Y-%m-%d %T') AS modTime, content, viewCount FROM bbs WHERE bid = ?`;
            conn.query(sql, bid, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback(rows[0]);
            });
            conn.end();
        },

        incrementCount:    function(bid, callback) {
            let conn = this.getConnection();
            let sql = `update bbs set viewCount = viewCount+1 WHERE bid=?;`;
            conn.query(sql, bid, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback();
            });
            conn.end();
        },


        registerUser : function(params, callback){
            let sql = `insert into users(uid, pwd, uname, tel, email) values(?, ?, ?, ?, ?);`;
            let conn = this.getConnection();
            conn.query(sql, params, function(error, fields){
                if(error)
                console.log(error);
                callback();
            });
            conn.end();   
        },
    
        getUserInfo :    function(uid, callback) {
            let conn = this.getConnection();
            let sql = `select * from users where uid like ?;`;
            conn.query(sql, uid, (error, results, fields) => {
                if (error)
                    console.log(error);
                    callback(results[0]);   // 주의할 것
                });
                conn.end();
            },

        getWrite:    function(params, callback) {
            let conn = this.getConnection();
            let sql = `insert into bbs(uid, title, content) VALUES(?, ?, ?);`;
            conn.query(sql, params, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback();
                });
                conn.end();
            },

        getInfo: function(uid, callback){
            let conn = this.getConnection();
        let sql = `SELECT uid, uname, tel, email, date_format(regDate, '%Y-%m-%d %T') AS regDate FROM users where isDeleted=0;`;
        conn.query(sql, uid, (error, rows, fields) =>{
            if(error)
                console.log(error);
            callback(rows);
            });
            conn.end();
        },

        /* deleteUser: function(uid, callback){
            let conn = this.getConnection();
            let sql = `delete from users where uid= ?`;
            conn.query(sql, uid, (error, rows, fields) =>{
                if(error)
                console.log(error);
                callback(rows);
                });
                conn.end();   
            }, */

        deleteUser:     function(uid, callback) {
            let conn = this.getConnection();
            let sql = `update users set isDeleted=1 where uid=?;`;
            conn.query(sql, uid, (error, fields) => {
                if (error)
                    console.log(error);
                callback();
            });
            conn.end();
            },
        
        getDelete: function(bid, callback){
            let conn = this.getConnection();
            let sql = `delete from bbs where bid= ?`;
            conn.query(sql, bid, (error, rows, fields) =>{
                if(error)
                console.log(error);
                callback(rows);
                });
                conn.end();   
            },

        getUser: function(uid, callback){
            let sql = `SELECT * from users WHERE uid=?;`
            let conn = this.getConnection();
            conn.query(sql, uid, function(error, rows, fields){
                if(error)
                    console.log(error);
                callback(rows[0]);     
            });
            conn.end();  
        },


        updateUser : function (params, callback){
            let sql = `update users set pwd=?, uname=?, tel=?, email=? where uid=?`;
            let conn = this.getConnection();
            conn.query(sql, params, function(error, fields){
                if(error)
                console.log(error);
                callback();
            });
            conn.end();   
        }
}
            
        /* getContents:    function(bid, callback) {
            let conn = this.getConnection();
            let sql = `SELECT bid, title, uid, date_format(modTime, '%Y-%m-%d %T') AS modTime, content, viewCount FROM bbs WHERE bid = ?`;
            conn.query(sql, bid, (error, rows, fields) => {
                if (error)
                    console.log(error);
                callback(rows[0]);
            });
            conn.end();
        }, */


            /* deleteUser : function(uid, callback){
                let sql = `delete from users where sid =?`;
                let conn = this.getConnection();
                conn.query(sql, uid, function(error, fields){
                    if(error)
                    console.log(error);
                    callback();
                });
                conn.end();   
            }, */
            /* updateUser : function(params, callback){
                let sql = `update users set email=?, tel=?, pwd=? where uid=?`;
            let conn = this.getConnection();
            conn.query(sql, params, function(error, fields){
                if(error)
                console.log(error);
                callback();
            });
            conn.end();   
        } */