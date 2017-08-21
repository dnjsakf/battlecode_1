module.exports = function(conn){
  let route = require('express').Router();
  route.get('/qState/dashboard', function(req, res){
    let isMine = req.query.isMineAlgo,
        qNo = req.query.qNo,
        mNo = req.query.mNo,
        page = parseInt(req.query.page),
        rows = parseInt(req.query.rows),
        sort = req.query.sort,
        condition = req.query.condition,
        select = req.query.select,
        join = req.query.join;

    let start = ((page - 1) * rows);
    let sql;
    // SELECT
    sql = 'SELECT qState.*, member.name ' + select +' ';
    sql += 'FROM qState ';
    // JOIN
    sql += 'INNER JOIN member ';
    sql += 'ON qState.mNo = member.no ';
    sql += join + ' ';
    // WHERE
    sql += 'WHERE qState.qNo = ? ';
    if(isMine === 'true'){ sql += 'AND not qState.mNo = ? '; }  // 내 정보만 빼고
    sql += 'AND '+ condition +' ';
    // ORDER BY
    sql += sort + ' ';
    // LIMIT
    sql += 'LIMIT ' + start + ', ' + rows;

    console.log(sql);
    conn.query(sql, [qNo,mNo], function(error, info){
      if(error){
        // 실패
        console.log("[dashboard error]");
        console.log(error);
        res.send({result:false, data:'test'});
      } else{
        // 성공
        console.log("[dashboard success]", info.length);
        let tags = [],
            index = 0;
        for(index in info){
          let tag = '';
          tag += '<tr>';
          // tag += `  <td class='no'>${info.length - parseInt(index)}</td>`;
          tag += `  <td class='no'>${info[index].no}</td>`;
          tag += `  <td class='username'>${info[index].name}</td>`;
          tag += `  <td class='language'>${info[index].language}</td>`;
          tag += `  <td class='score'>${info[index].result}</td>`;
          if(isMine === 'true'){
            tag += `  <td class='compare' onClick='deatil_viewer(${info[index].no}, ${info[index].qNo})'>비교하기</td>`;
          }
          tag += `<td class='date'>${info[index].date}</td>`;
          tag += `</tr>`;
          tags.push(tag);
        }
        let count = info.length > 0 ? info[0].count : 0;
        res.send({result:true, data:tags, count:count});
      }
    });
  });
  return route;
};
