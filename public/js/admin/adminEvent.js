$(function(){
	/*  VARIALBE
	 *  jquery elements
	 */
	let $elements = {
		'section':{
			'detail':{
				'all': $('section.detail-section'),
				'list': $('section.detail-section.list-data'),
				'viewer': $('section.detail-section.viewer-data'),
			},
		},
		'list': {
			'block':{
				'all': $('div.manage-list-block'),
				'member':$('div.manage-list-block.member'),
				'questions':$('div.manage-list-block.questions'),
				'notice':$('div.manage-list-block.notice'),
				'report':$('div.manage-list-block.report'),
			},
			'table':{
				'member':$('table#manage-list-table-member'),
				'questions':$('table#manage-list-table-questions'),
				'notice':$('table#manage-list-table-notice'),
				'report':$('table#manage-list-table-report'),
			},
		},
		'viewer':{
			'block':{
				'all': $('div.manage-viewer-block'),
				'member':$('div.manage-viewer-block.member'),
				'questions':$('div.manage-viewer-block.questions'),
				'notice':$('div.manage-viewer-block.notice'),
				'report':$('div.manage-viewer-block.report'),
			},
			'table':{
				'member':$('table#manage-viewer-table-member'),
			}
		},
	};


	/*  NORMAL FUNCTION
	 *  create page button to page-controller element
	 */
	create_page_button = function(type, tableName, $element, count){
		$element.empty();
		let page = 0;
		do {
			page += 1;
			onClickEvent = "handleManageSelect('"+type+"', '"+tableName+"',"+page+")";
			let tag = '<button type="button" onClick="'+onClickEvent+'">'+page+'</button>'
			$element.append(tag);
		} while (page < count);
	};

	/*  MNEU HANDLE EVENT
	 *  GET LIST
	 */
	handleManageSelect = function(type, tableName, page, userKey){
		console.log(type,tableName, page);
		let $setElements = $elements[type].block[tableName];
		let	$table = $elements[type].table[tableName],
				$controller = $setElements.find('div.page-buttons'),
				$tableHeader = $table.find('th'),
				tableHeaderSize = $tableHeader.length,
				index = 0,
				fieldNames = [];

		let getDataInfo = {
			'page': page,
			'rows': 10,
			'userKey': userKey,
		};

		for(;index < tableHeaderSize; index++){
			fieldNames[index] = $tableHeader.eq(index).attr('class');
		}

		$elements.section.detail.all.addClass('hidden');
		$elements.section.detail[type].removeClass('hidden');

		$elements[type].block.all.addClass('hidden');
		$setElements.removeClass('hidden');

		ajax_get_data(type, tableName, fieldNames, getDataInfo).
			then(
				function(result){
					if(result.result){
						// console.log('[ajax-success]',result.data, result.count);
						// 성공
						let tags = result.data,
								$tbody = $table.find('tbody'),
								count = result.count
								rows = getDataInfo.rows,
								pageCount = parseInt(count/rows) + 1;

						$tbody.empty();
						$tbody.append(tags);

						create_page_button(type, tableName, $controller, pageCount);
					} else {
						console.log('ajax-failed', result.data);
					}
				},
				function(error){
					console.log('ajax-failed', error);
					// 실패
				});
	};
});
