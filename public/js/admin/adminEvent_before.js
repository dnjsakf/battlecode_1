$(function(){
	/*  VARIALBE
	 *  jquery elements
	 */
	const $elements = {
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
	createSelectPageButton = function(tableName, $element, count){
		$element.empty();
		let page = 0;
		do {
			page += 1;
			onClickEvent = "getManageSelectData('"+tableName+"',"+page+")";
			let tag = '<button type="button" onClick="'+onClickEvent+'">'+page+'</button>'
			$element.append(tag);
		} while (page < count);
	};

	getManageSelectData = function(tableName, page, userKey){
		let $setElements = $elements.list.block[tableName];
		let	$table = $elements.list.table[tableName],
				$controller = $setElements.find('div.page-buttons'),
				$tableHeader = $table.find('th'),
				tableHeaderSize = $tableHeader.length,
				index = 0,
				fieldNames = [];

		let getDataInfo = {
			'page': page,
			'rows': 10
		};

		for(;index < tableHeaderSize; index++){
			fieldNames[index] = $tableHeader.eq(index).attr('class');
		}

		$elements.section.detail.all.addClass('hidden');
		$elements.section.detail.list.removeClass('hidden');

		$elements.list.block.all.addClass('hidden');
		$setElements.removeClass('hidden');

		ajaxGetSelectData(tableName, fieldNames, getDataInfo).
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

					createSelectPageButton(tableName, $controller, pageCount);
				} else {
					console.log('ajax-failed', result.data);
				}
			},
			function(error){
				console.log('ajax-failed', error);
				// 실패
			}
		);
	};



	createViewerPageButton = function(tableName, $element, count){
		$element.empty();
		let page = 0;
		do {
			page += 1;
			onClickEvent = "getManageViewerList('"+ tableName +"',"+ page +")";
			let tag = '<button type="button" onClick="'+ onClickEvent +'">'+ page +'</button>'
			$element.append(tag);
		} while (page < count);
	};

	getManageViewerData = function(tableName, userKey){
		let $setElements = $elements.viewer.block[tableName];
		
		// list
		$elements.section.detail.all.addClass('hidden');
		$elements.section.detail.viewer.removeClass('hidden');

		// viewer
		$elements.viewer.block.all.addClass('hidden');
		$setElements.removeClass('hidden');


	}

	// getManageViewerList('member', 1, 12)
	getManageViewerTable = function(tableName, page, userKey){
		// table-data
		// "member-table"일 때만 qState를 한번 더 조회해야함.
		// 다른 테이블의 경우에는 해당 테이블에 있는 데이터만 조회하면됨.
		let $setElements = $elements.viewer.block[tableName];
		let	$table = $elements.viewer.table[tableName],
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

		// list
		$elements.section.detail.all.addClass('hidden');
		$elements.section.detail.viewer.removeClass('hidden');

		// viewer
		$elements.viewer.block.all.addClass('hidden');
		$setElements.removeClass('hidden');

		ajaxGetViewerData(tableName, fieldNames, getDataInfo).
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

					createSelectPageButton(tableName, $controller, pageCount);
				} else {
					console.log('ajax-failed', result.data);
				}
			},
			function(error){
				console.log('ajax-failed', error);
				// 실패
			}
		);
	};
});
