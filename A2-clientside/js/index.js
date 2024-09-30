function search() {
  const organizer = document.getElementById('C').value
  const city = document.getElementById('D').value
  const categoryId = document.getElementById('E').value
  getSearch({ organizer, city, categoryId })
}

function clearCheckboxes() {
  document.getElementById('C').value = ''
  document.getElementById('D').value = ''
  document.getElementById('E').value = ''
  getSearch({})
}

function toDetails(id) {
  window.location.href = './details.html?id=' + id
}

function template(data, index) {
  return `
		<li class="item" onclick="toDetails(${data.FUNDRAISER_ID})">
          <div class="card">
            <div class="image">
              <img class="img" src="./image/img${data.FUNDRAISER_ID}.png" alt="" />
              <div class="money">
                <p class="text-base">Current:&nbsp;$${data.CURRENT_FUNDING}</p>
                <p class="text-base">Target:&nbsp;$${data.TARGET_FUNDING}</p>
              </div>
            </div>
            <div class="info">
              <h4>${data.CAPTION}</h4>
              <div class="combination">
			  	<p class="address">${data.ORGANIZER}</p>
				<p>|</p>
                <p class="type">${data.CATEGORY_NAME}</p>
				<p>|</p>
                <p class="address">${data.CITY}</p>
				<p>|</p>
                <p class="type">${data.ACTIVE === 1 ? 'Underway' : 'Stop'}</p>
              </div>
              <div class="about">
               <p>Imagine the devastation of having your home and community torn apart by a hurricane. With several hurricanes expected this season, the 2024 Hurricane Relief Fund by GiveSendGo Charities is here to provide critical financial relief to those affected.</p>

				<p>As part of our Care & Relief fund, 100% of your donation goes directly to those in need, with GiveSendGo.com covering all Stripe processing fees. All donations are tax-deductible and will be distributed as grants to campaigns hosted on GiveSendGo.com.</p>

				<p>If you or someone you know has been impacted by these hurricanes, we encourage you to start a campaign on GiveSendGo.com and apply for a grant on our website GiveSendGo.org.</p>

				<p>Your generous support can bring hope and relief to those facing this devastating reality. Join us in making a difference. Donate now to help hurricane victims rebuild their lives.</p>
              </div>
            </div>
          </div>
        </li>
	`
}

function templateDetail(data) {
  return `
	<div class="widthCenter">
        <div class="left">
          <img src="./image/img${data.FUNDRAISER_ID}.png" alt="" />
          <h4>${data.CAPTION}</h4>
          <div class="combination">
            <p class="address">${data.CITY}</p>
            <p class="address">${data.CATEGORY_NAME}</p>
            <p class="type">${data.ACTIVE === 1 ? 'Underway' : 'Stop'}</p>
          </div>
          <div class="about">
           <p>Imagine the devastation of having your home and community torn apart by a hurricane. With several hurricanes expected this season, the 2024 Hurricane Relief Fund by GiveSendGo Charities is here to provide critical financial relief to those affected.</p>

				<p>As part of our Care & Relief fund, 100% of your donation goes directly to those in need, with GiveSendGo.com covering all Stripe processing fees. All donations are tax-deductible and will be distributed as grants to campaigns hosted on GiveSendGo.com.</p>

				<p>If you or someone you know has been impacted by these hurricanes, we encourage you to start a campaign on GiveSendGo.com and apply for a grant on our website GiveSendGo.org.</p>

				<p>Your generous support can bring hope and relief to those facing this devastating reality. Join us in making a difference. Donate now to help hurricane victims rebuild their lives.</p>
          </div>
        </div>
        <div class="right">
          <div class="card">
            <div class="money">
              <p class="text-base">Current:&nbsp;$${data.CURRENT_FUNDING}</p>
              <p class="text-base">Target:&nbsp;$${data.TARGET_FUNDING}</p>
            </div>
            <div class="dinfo">
              <div>Campaign created by RiseTogether Charities</div>
              <div>Campaign funds will be received by RiseTogether Charities</div>
            </div>
            <div style="padding: 16px"><div class="button" onclick='alert("This feature is under contruction")'>Donate</div></div>
          </div>
        </div>
      </div>
	`
}

// 选择器
function templateOption(data) {
  return `<option value="${data.CATEGORY_ID}" style="height: 0">${data.NAME}</option>`
}

// 获取首页公益列表
function getFundraisers() {
  fetch('http://localhost:3000/fundraisers')
    .then(response => response.json())
    .then(res => {
      res.forEach((element, index) => document.getElementById('A').insertAdjacentHTML('beforeend', template(element, index)))
    })
}

// 获取公益详情
function getDetails(id) {
  fetch('http://localhost:3000/fundraiser/' + id)
    .then(response => response.json())
    .then(res => {
      document.getElementById('B').insertAdjacentHTML('beforeend', templateDetail(res))
    })
}

// 获取 所有类别
function getCategories() {
  fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(res => {
      res.forEach(item => document.getElementById('E').insertAdjacentHTML('beforeend', templateOption(item)))
    })
}

// search
function getSearch(params) {
  const paramsUrl = new URLSearchParams(params)
  fetch(`http://localhost:3000/search?${paramsUrl}`)
    .then(response => response.json())
    .then(res => {
      document.getElementById('F').innerHTML = ''
      res.forEach(item => document.getElementById('F').insertAdjacentHTML('beforeend', template(item)))
    })
}
