// 搜索
function search() {
  // 获取form表单数据
  const organizer = document.getElementById('C').value
  const city = document.getElementById('D').value
  const categoryId = document.getElementById('E').value
  // 查询
  getSearch({ organizer, city, categoryId })
}

// clear form 数据
function clearCheckboxes() {
  document.getElementById('C').value = ''
  document.getElementById('D').value = ''
  document.getElementById('E').value = ''
  getSearch({})
}

// 跳转详情页
function toDetails(id) {
  window.location.href = './details.html?id=' + id
}

function text(index) {
  const textareaText = [
    `<p>Imagine the devastation of having your home and community torn apart by a hurricane. With several hurricanes expected this season, the 2024 Hurricane Relief Fund by RiseTogether Charities is here to provide critical financial relief to those affected.</p>

      <p>As part of our Care & Relief fund, 100% of your donation goes directly to those in need, with RiseTogether.com covering all Stripe processing fees. All donations are tax-deductible and will be distributed as grants to campaigns hosted on RiseTogether.com.</p>

      <p>If you or someone you know has been impacted by these hurricanes, we encourage you to start a campaign on RiseTogether.com and apply for a grant on our website RiseTogether.org.</p>

      <p>Your generous support can bring hope and relief to those facing this devastating reality. Join us in making a difference. Donate now to help hurricane victims rebuild their lives.</p>
    `,
    `
      <p>As our charity has grown, there have become more opportunities than ever to use the tools we've been given to impact the world in powerful ways. As many know, our organization takes 0% from donations in our Giver Army and our Care & Relief Campaigns (our two largest efforts), </p><p>allowing for the most significant level of nonprofit transparency and for the greatest impact from every donation.</p>
      <p>Learn more at www.RiseTogether.org</p>
      <p>How can we run if we don't take any fees? RiseTogether.com has generously made this possible by covering processing fees and helping fund some of our projects, but the need for more tools is constantly growing. Now more than ever, the world has become relatively small in our eyes as the needs become great. With more resources, we can amp up our efforts and create even more effective ways to impact people facing crisis. </p>
      <p>We've set up this fund for those who believe in our mission and want to directly impact our organization by funding our growth. Growth for our organization doesn't look like bigger paychecks for our directors, but it’s an opportunity to get our causes out there on a grander scale, allowing us to find and impact even more people in need. </p>
      <p>Join us in making an impact!</p>
      `,
    `
      <p>Lee, Alexis and Xander have felt, for many years, that their family has not been complete. After fostering a child in need, they decided that saying goodbye to the child they have grown to love was something their hearts could not handle and decided to grow their family through adoption. After many (many) months of praying, they were notified this past week that a baby was available. </p>

      <p>Aliyah, a precious one month old, whose birth mother made the ultimate sacrifice, had a tragic start to her life.  She was born pre-maturely and was left in a box on the outside of the hospital in Brevard County. </p>

      <p>On Monday, Lee, Alexis and Xander were able to meet and hold her and Aliyah instantly stole their hearts and they knew God had placed her in their lives as the next member of their family.</p>

      <p>As such, adoption is never free. This campaign is to assist them in the funds needed to cover the legal and state fees required to make Aliyah a "Lovette" and to change what could have been a tragic story into one that only God knows how to write. </p>
    `,
    `
      <p>The aftermath of Hurricane Helene has left many of us struggling to grasp the full scale of the devastation in Western North Carolina, South Carolina, Tennessee, and Georgia. The damage to our beloved mountain region is unimaginable, and countless families are in desperate need of help. If you're like me, you're eager to contribute but may not be sure how.</p>

      <p>To make it easier for our community to take action, Provident Wealth Management is stepping up as a local donation hub for much-needed supplies. We have partnered with trusted local organizations to ensure that all donations are delivered promptly to the areas hardest hit. We’ll be making deliveries over the next two weeks, and every contribution counts.</p>
    `,
    `
      <p>Please join me in lending a gracious hand to my cousin, Lucas Frazier and his wife, Alex. They were able to escape from their home in the middle of a massive mudslide just outside of Asheville, NC. Although Asheville had made preparations for rising waters in town, I don’t think a mudslide/landslide ever cross anyone’s minds! Lucas and Alex’s house was swept off of its foundation and traveled a great distance before crashing into another home. </p>

      <p> Alex suffered a severe cut on her ankle as they were escaping thru a window of their home and had to be taken to a local hospital via helicopter. Lucas had to stay behind and had no communication with his wife for two days & two nights. Eventually, they ended up in different shelters for the remainder of the weekend.</p>

      <p>This family lost everything they owned in the mudslide, including their vehicles & Lucas’ tools, with which he makes a living. Thankfully, by the grace of God, they were able to escape the situation. They are now being taken into my Aunt and Uncles home in Rockwell, NC. They are still trying to process this whole experience, but the bottom line is that all they had just a few days ago… is now gone.</p>

      <p>Please join me in giving, so that this beautiful family can start rebuilding their future together.</p>
      <p>Thank you in advance and God Bless! </p>

      <p>P.S. The Pic was taken by Lucas Frazier. This photo was taken standing in what used to be his living room. If you look closely, you will see part of a small red metal roof. That is the second story roof of their home! </p>
    `,
  ]
  return textareaText[index - 1]
}

// 首页列表模板
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
               ${text(data.FUNDRAISER_ID)}
              </div>
            </div>
          </div>
        </li>
	`
}

// 详情模板
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
            ${text(data.FUNDRAISER_ID)}
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

// 获取首页列表
function getFundraisers() {
  fetch('http://localhost:3000/fundraisers')
    .then(response => response.json())
    .then(res => {
      res.forEach((element, index) => document.getElementById('A').insertAdjacentHTML('beforeend', template(element, index)))
    })
}

// 获取详情
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

// 获取搜索列表
function getSearch(params) {
  const paramsUrl = new URLSearchParams(params)
  fetch(`http://localhost:3000/search?${paramsUrl}`)
    .then(response => response.json())
    .then(res => {
      document.getElementById('F').innerHTML = ''
      res.forEach(item => document.getElementById('F').insertAdjacentHTML('beforeend', template(item)))
    })
}
