module.exports = function(conn){
  let request = require('request'),
      cheerio = require('cheerio'),
      moment = require('moment'),
      route = require('express').Router(),
      fs = require('fs'),
      path = require('path');

  date = moment().format('YYYY-MM-DD');

  route.get('/main', function(req, res){
    res.sendfile('./public/html/crawler/crawler_main.html');
  });

  route.post('/backjoon', function(req, res){
    let default_url = req.body.url,
        default_start = req.body.start,
        default_end = req.body.end;

    let crawled_data = {},
        urls = making_url(default_url, default_start, default_end),
        problem = '';

    let promise = [],
        index = 0,
        end = urls.length;

    for(; index < end; index++){
      let problem = urls[index];
      let req_promise = new Promise(function(resolve, reject){
        request(problem, function(error, response, html){
          console.log(index, ' - ', problem);
          if(error){
            reject(false);
            throw error;
          }
          let $ = cheerio.load(html),
              splited = problem.split('/');
          let key = splited[splited.length-1];

          let $input_data = $('section#sampleinput > pre.sampledata'),
              $output_data = $('section#sampleoutput > pre.sampledata'),
              $original_source_data = $('section#source > ul > li'),
              $question = $('div#problem_description > *'),
              $input_info = $('div#problem_input > *'),
              $output_info = $('div#problem_output > *');

          let input_size = $input_data.length,
              output_size = $output_data.length,
              source_size = $original_source_data.length,
              question_size = $question.length,
              input_info_size = $input_info.length,
              output_info_size = $output_info.length;

          let input = {},
              output = {},
              original_source = {},
              question = {},
              input_info = {},
              output_info = {};

          // input
          for(let index=1; index <= input_size; index++){
            let $tag = $input_data.eq(index-1);
            let text = $tag.text().toString();
            input[index] = text.split(/\r?\n/);
          }
          input = last_blank(input);

          // output
          for(let index=1; index <= output_size; index++){
            let $tag = $output_data.eq(index-1);
            let text = $tag.text().toString();
            output[index] = text.split(/\r?\n/);
          }
          output = last_blank(output);

          // question
          for(let index=1; index <= question_size; index++){
            let $tag = $question.eq(index-1);

            // 이미지 저장
            if($tag.find('img').length > 0){
              let $img = $tag.find('img'),
                  imgPath = $img.attr('src');
              let imgURL = "https://www.acmicpc.net" + imgPath;
              let filename = imgPath.replace(/\/.*\//, '');
              let myPath = path.join('/images/questions/', filename);
              let savePath = path.join(__dirname, '../../public', myPath);
              request.head(imgURL, function(err, res, body){
                request(imgURL).pipe(fs.createWriteStream(savePath)).on('close', function(){});
              });
              $img.attr({'src':myPath});
              $img.removeAttr('style');
            }
            question[index] = $tag.toString(); // 재탐색
          }

          // input_info
          for(let index=1; index <= input_info_size; index++){
            let $tag = $input_info.eq(index-1);
            input_info[index] = $tag.toString();
            console.log(typeof $tag, $tag);
            console.log(input_info[index]);
          }

          // output_info
          for(let index=1; index <= output_info_size; index++){
            let $tag = $output_info.eq(index-1);
            output_info[index] = $tag.toString();
          }

          // original_source
          for(let index=1; index <= source_size; index++){
            let $tag = $original_source_data.eq(index-1);
            let text = $tag.text().toString();
            original_source[index] = text.replace(/[\n\t]/gm, '');
          }

          crawled_data[key] = {
            // single_line
            'url': problem,
            'limit_time' : $('table#problem-info td:nth-child(1)').text(),
            'limit_memory' : $('table#problem-info td:nth-child(2)').text(),
            'challengers' : $('table#problem-info td:nth-child(3)').text(),
            'current_answer' : $('table#problem-info td:nth-child(4)').text(),
            'perfect' : $('table#problem-info td:nth-child(5)').text(),
            'current_persent' : $('table#problem-info td:nth-child(6)').text(),
            'subject' : $('span#problem_title').text(),

            // multi_line
            'question' : JSON.stringify(question),
            'input_info' : JSON.stringify(input_info),
            'output_info' : JSON.stringify(output_info),
            'input' : JSON.stringify(input),
            'output' : JSON.stringify(output),
            'original_source' : JSON.stringify(original_source),
            'author': 1,
            'date': date,
          }

          save_db(conn, key, crawled_data[key]);

          resolve(true);
        });
      });
      promise.push(req_promise);
    }
    Promise.all(promise).then(function(result){
      res.send({data:crawled_data, result:result, promise:promise.length});
    });
  });

  return route;
}

last_blank = function(ob){
  for(let key in ob){
    let arr = ob[key];
    if(arr[arr.length-1] === ''){
      ob[key] = arr.slice(0, -1);
    }
  }
  return ob;
}

// 'https://www.acmicpc.net/problem/1000' ~
making_url = function(url, index, end){
  let converted = [];
  for(; index <= end; index++){
    converted.push(url + index);
  }
  return converted;
};

save_db = function(conn, key, data){
  let fields = Object.keys(data),
      values = [];
  for(let key in data){
    values.push(data[key])
  }
  let sql = `INSERT INTO backjoon_questions (${fields}) VALUES (?)`;
  conn.query(sql,[values], function(error, result){
    if(error) throw error
  });
}
