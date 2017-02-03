(function () {

    var _webSqlDataBase = function (dataBaseInfo, dataTable) {

        if(!dataBaseInfo['name']) return;
        
        /* 设置数据库初始值 */
        var dbName = dataBaseInfo.name || "newWebSqlDataBase",
            dbVersion = dataBaseInfo.version || '0',
            dbTitle = dataBaseInfo.title || "Test DB",
            dbSize = dataBaseInfo.size * 1024 *1024 || 10 * 1024 *1024,
            dbReturn = dataBaseInfo.object || null;


        var webSql = dataBaseInfo ? openDatabase(dbName, dbVersion, dbTitle, dbSize) : console.log('dataBaseInfo 未定义');

        var dataIndex = '';
        var dataIndexArr = [];
        var sqlScript = '';
        var tableName;

        webSql.transaction( function(tx) {

            if(!dataTable) return;
            
            for(var o in dataTable) {

                dataIndex = '';

                for(var i=0, int=dataTable[o].length; i<int; i++) {
                    if(i == int-1) {
                        dataIndex += dataTable[o][i];
                    } else {
                        dataIndex += dataTable[o][i] + ',';
                    }
                }
                
                sqlScript = 'CREATE TABLE IF NOT EXISTS ' + o + ' (' + dataIndex + ')';

                tx.executeSql(sqlScript);

            }
            
        });

        this.open = function(_tableName) {
            
            dataIndex = '';
            tableName = _tableName;

            if(!tableName) return;
            dataIndexArr = [];
            for(var i=0, int=dataTable[tableName].length; i<int; i++) {

                if(i == int-1) {
                    dataIndex += dataTable[tableName][i];
                    dataIndexArr.push(dataTable[tableName][i].replace(' unique',''));
                } else {
                    dataIndex += dataTable[tableName][i] + ',';
                    dataIndexArr.push(dataTable[tableName][i].replace(' unique',''));
                }
            }
            
            return this;
        }

        /**
         * 增加数据
         * 
         * @param {array Object} contentObjcet
         */
        this.add = function(contentObjcet) {
                        console.log(contentObjcet)
            
            webSql.transaction(function (tx){
            
                if(!contentObjcet) return;

                dataIndex = dataIndex.replace(' unique','');
                    
                if(contentObjcet.length) {

                    for(var o=0, aObj=contentObjcet.length; o<aObj; o++) {

                        var content = "'";

                        for(var i=0, int=dataIndexArr.length; i<int; i++) {
                            if(i == int-1) {
                                content += contentObjcet[o][dataIndexArr[i]] + "'";
                            } else {
                                content += contentObjcet[o][dataIndexArr[i]] + "','";
                            }
                        }
                        
                        sqlScript = 'INSERT INTO ' + tableName + ' (' + dataIndex + ') VALUES (' + content + ')';
                        
                        console.log(sqlScript)

                        tx.executeSql(sqlScript);

                    }

                } else {

                   var content = '"';
                    
                    for(var i=0, int=dataIndexArr.length; i<int; i++) {
                        if(i == int-1) {
                            content += contentObjcet[dataIndexArr[i]] + "'";
                        } else {
                            content += contentObjcet[dataIndexArr[i]] + "',";
                        }
                    }

                    sqlScript = 'INSERT INTO ' + tableName + ' (' + dataIndex + ') VALUES (' + content + ')';

                    tx.executeSql(sqlScript);

                }

            });
    
        
    

        }

        this.delete = function(_uid) {
            webSql.transaction(function(tx) {
                var sqlScript = 'DELETE FROM ' + tableName + ' WHERE uid="' + _uid + '"';
                tx.executeSql(sqlScript);
            });
        }

        this.show = function(_target, _explicit, _datafn, _judge) {
            
            var dataObjcet = [];
            var sqlScript = 'SELECT * FROM ' + tableName;
            
            webSql.transaction(function (tx){

              tx.executeSql(sqlScript, [], function (tx, results) {

                    var len=results.rows.length;
                    
                    for(var i=0; i<len; i++) {

                        if(typeof(_target) == 'function') {

                            dataObjcet.push(results.rows.item(i));

                        } else {

                            if(_target){

                                var res = results.rows.item(i);
                                if(res[_target].indexOf(_explicit) >= 0) {
                                    dataObjcet.push(res);
                                }
                                
                            } else {
                                var res = results.rows.item(i);
                                for(var o in res) {
                                    if(res[o].indexOf(_explicit) >= 0) {
                                        dataObjcet.push(res);
                                        break;
                                    }
                                }
                                
                            }

                        }

                    }
                    if(typeof(_target) == 'function') {
                        _target(dataObjcet);
                    } else {
                        _datafn(dataObjcet);
                    }

                    if(_judge) dataObjcet.length>0 ? _judge = true : _judge = false;

                });
                
            });

        }

        this.update = function(_uid, _target, _value) {
            webSql.transaction(function(tx) {
                var sqlScript = "UPDATE " + tableName + " SET " + _target + "='" + _value + "' WHERE uid='" + _uid + "'";
                
                tx.executeSql(sqlScript);
            });
        }

    }

    window.webSqlDataBase = new function () {
        return _webSqlDataBase;
    }

}());


