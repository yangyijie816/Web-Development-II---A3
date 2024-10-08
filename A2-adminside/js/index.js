// 确定删除提示框
function showConfirm(id) {
  const result = confirm('Are you sure you want to delete it?')
  if (result) {
    console.log('确定删除')
  } else {
    console.log('取消删除')
  }
}

// Search
function searchTable() {
  // Get form form data
  const organizer = document.getElementById('organizer').value
  const city = document.getElementById('city').value
  const categoryId = document.getElementById('category').value
  // Inquire
  getFundraisers({ organizer, city, categoryId })
}

// clear form DATA
function clearCheckboxes() {
  document.getElementById('organizer').value = ''
  document.getElementById('city').value = ''
  document.getElementById('category').value = ''
  getFundraisers({})
}

// 是否显示no-data提示
function showNoData(isShow = true) {
  if (isShow) {
    document.querySelector('.no-data').style.display = 'block'
  } else {
    document.querySelector('.no-data').style.display = 'none'
  }
}

// 创建类别table渲染模板
function CreateCategoriesTemplate(data) {
  return `
	<tr>
		<td>${data.CATEGORY_ID}</td>
		<td>${data.NAME}</td>
	</tr>
  `
}
//  创建筹款活动table渲染模板
function CreateFundraisersTemplate(data) {
  return `
	<tr>
		<td>${data.FUNDRAISER_ID}</td>
		<td>${data.CAPTION}</td>
		<td>${data.ORGANIZER}</td>
		<td>${data.TARGET_FUNDING}</td>
		<td>${data.CURRENT_FUNDING}</td>
		<td>${data.CITY}</td>
		<td>${data.ACTIVE == 1 ? 'Underway' : 'Finished'}</td>
		<td>${data.CATEGORY_NAME}</td>
		<td>
		<div>
			<a href="./fundraiser-edit.html?id=${data.FUNDRAISER_ID}" class="button default">Edit</a>
			<a href="#" onclick="showConfirm(${data.FUNDRAISER_ID})" class="button delete">Delete</a>
		</div>
		</td>
	</tr>
  `
}

// Selector
function templateOption(data) {
  return `<option value="${data.CATEGORY_ID}" style="height: 0">${data.NAME}</option>`
}

// 回填表单数据
function backfillFormData(data) {
  document.getElementById('FUNDRAISER_ID').value = data.FUNDRAISER_ID
  document.getElementById('CAPTION').value = data.CAPTION
  const options = document.getElementById('category').options
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      const element = options[key]
      if (Number(element.value) === Number(data.CATEGORY_ID)) {
        element.selected = true
      }
    }
  }
  document.getElementById('ORGANIZER').value = data.ORGANIZER
  document.getElementById('TARGET_FUNDING').value = data.TARGET_FUNDING
  document.getElementById('CITY').value = data.CITY
  const radios = document.getElementsByName('ACTIVE')
  for (const radio of radios) {
    if (radio.value === data.ACTIVE) {
      radio.checked = true // 设置为选中
    }
  }
  document.getElementById('DESCRIPTION').value = data.DESCRIPTION || ''
}

// 调接口获取所有类别数据
function getCategories(isTable = true) {
  fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(res => {
      if (isTable) {
        if (res.length == 0) {
          return showNoData()
        } else {
          showNoData(false)
        }
        res.forEach(item => document.getElementById('Table').insertAdjacentHTML('beforeend', CreateCategoriesTemplate(item)))
      } else {
        res.forEach(item => document.getElementById('category').insertAdjacentHTML('beforeend', templateOption(item)))
      }
    })
}

// 获取所有筹款活动数据
function getFundraisers(params) {
  const paramsUrl = new URLSearchParams(params)
  fetch(`http://localhost:3000/search?${paramsUrl}`)
    .then(response => response.json())
    .then(res => {
      document.getElementById('Table').innerHTML = ''
      if (res.length == 0) {
        return showNoData()
      } else {
        showNoData(false)
      }
      res.forEach((element, index) => document.getElementById('Table').insertAdjacentHTML('beforeend', CreateFundraisersTemplate(element, index)))
    })
}

// Get details
function getDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  fetch('http://localhost:3000/fundraiser/' + urlParams.get('id'))
    .then(response => response.json())
    .then(res => {
      console.log(res)
      // 回填表单数据
      backfillFormData(res)
    })
}
