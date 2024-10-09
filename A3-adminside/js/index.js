// 清除当前页面跳转，解决back无法刷新问题
function goBack(url) {
  window.location.replace(url) // 替换为目标
}
// 确定删除提示框
function showConfirm(id) {
  const result = confirm('Are you sure you want to delete it?')
  if (result) {
    deleteFundraiser(id)
  }
}

// 提示 message
function showMessage(type, message) {
  const alertBox = document.createElement('div')
  alertBox.className = 'message ' + (type === 'S' ? 'message-success' : 'message-error')
  alertBox.innerText = message
  document.body.appendChild(alertBox)
  setTimeout(() => {
    alertBox.remove()
  }, 2000)
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

// 获取form表单数据
function getFormData() {
  const urlParams = new URLSearchParams(window.location.search)
  const formData = {
    id: urlParams.get('id'),
    ORGANIZER: document.getElementById('ORGANIZER').value,
    CAPTION: document.getElementById('CAPTION').value,
    TARGET_FUNDING: document.getElementById('TARGET_FUNDING').value,
    // CURRENT_FUNDING: document.getElementById('CURRENT_FUNDING').value,
    CITY: document.getElementById('CITY').value,
    ACTIVE: 1,
    CATEGORY_ID: document.getElementById('category').value,
    DESCRIPTION: document.getElementById('DESCRIPTION').value,
  }
  const radios = document.getElementsByName('ACTIVE')
  for (const element of radios) {
    if (element.checked) {
      formData.ACTIVE = element.value
    }
  }

  return formData
}

// 绑定form表单提交事件
function setNewFormSubmit() {
  document.getElementById('newForm').addEventListener('submit', event => {
    event.preventDefault() // 阻止默认表单提交
    const formData = getFormData()
    // 如果有ID则更新，反之新增
    if (formData.id !== null) {
      putFundraiserInfo(formData.id, formData)
    } else {
      postFundraiserInfo(formData)
    }
  })
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
function CreateCategoriesTemplate(data, index) {
  return `
	<tr>
		<td>${index + 1}</td>
		<td>${data.NAME}</td>
	</tr>
  `
}
//  创建筹款活动table渲染模板
function CreateFundraisersTemplate(data, index) {
  return `
	<tr>
		<td>${index + 1}</td>
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
  // document.getElementById('CURRENT_FUNDING').value = data.CURRENT_FUNDING
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
  fetch('http://localhost:3090/categories')
    .then(response => response.json())
    .then(res => {
      if (isTable) {
        if (res.length == 0) {
          return showNoData()
        } else {
          showNoData(false)
        }
        res.forEach((item, index) => document.getElementById('Table').insertAdjacentHTML('beforeend', CreateCategoriesTemplate(item, index)))
      } else {
        res.forEach(item => document.getElementById('category').insertAdjacentHTML('beforeend', templateOption(item)))
      }
    })
}

// 获取所有筹款活动数据
function getFundraisers(params) {
  const paramsUrl = new URLSearchParams(params)
  fetch(`http://localhost:3090/search?${paramsUrl}`)
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
  fetch('http://localhost:3090/fundraiser/' + urlParams.get('id'))
    .then(response => response.json())
    .then(res => {
      // 回填表单数据
      backfillFormData(res)
    })
}

// 更新筹款人信息
function putFundraiserInfo(id, data) {
  delete data.id
  fetch(`http://localhost:3090/fundraiser/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => {
    if (res.status === 200) {
      showMessage('S', 'Update Successfully')
      // 2s 后返回上一页
      setTimeout(() => {
        goBack('./fundraiser.html')
      }, 2000)
    } else {
      showMessage('S', 'Update Failed')
    }
  })
}

// 新增筹款人
function postFundraiserInfo(data) {
  fetch(`http://localhost:3090/fundraiser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => {
    if (res.status === 200) {
      showMessage('S', 'Successfully Added')
      // 2s 后返回上一页
      setTimeout(() => {
        goBack('./fundraiser.html')
      }, 2000)
    } else {
      showMessage('E', 'Fail to add')
    }
  })
}

// delete Fundraiser
function deleteFundraiser(id) {
  fetch(`http://localhost:3090/fundraiser/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async res => {
    if (res.status === 200) {
      // 提示
      showMessage('S', 'successfully delete')
      // 刷新table
      searchTable()
    } else {
      const data = await res.json()
      showMessage('E', data.message)
    }
  })
}
