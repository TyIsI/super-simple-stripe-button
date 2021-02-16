var jQueryScriptOutputted = false
function initJQuery() {
  if (typeof jQuery == 'undefined') {
    if (!jQueryScriptOutputted) {
      jQueryScriptOutputted = true
      document.write(
        '<scr' +
          'ipt type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></scr' +
          'ipt>'
      )
    }
    setTimeout('initJQuery()', 50)
  }
}
initJQuery()

const s3b_api_call = async (rpc, params) => {
  let requestUri =
    S3B.siteurl +
    '/wp-content/plugins/super-simple-stripe-button/handler.php?cmd=' +
    rpc

  let requestResult =
    params !== undefined || params !== null
      ? await fetch(requestUri, params)
      : await fetch(requestUri)

  let requestData = await requestResult.json()

  return requestData.data
}

const s3b_init = async () => {
  console.log('Fetching Stripe key')
  let keyResult = await s3b_api_call('get-stripe-key')

  window.S3B.Stripe = Stripe(keyResult)

  s3b_attach_listeners()
}

const s3b_button_listener = async function () {
  let priceId = $(this).data('price-id')
  let quantity = $(this).data('quantity') || 1
  let mode = $(this).data('mode')

  console.log('s3b_create_checkout_session', priceId, mode, quantity)
  let sessionId = await s3b_create_checkout_session(priceId, mode, quantity)

  console.log('s3b_create_checkout_session', 'sessionId', sessionId)

  window.S3B.Stripe.redirectToCheckout({
    sessionId
  }).then(s3b_handle_result)
}

const s3b_attach_listeners = async (stripe) => {
  $('.s3b-button').on('click', s3b_button_listener)
}

const s3b_create_checkout_session = async (priceId, mode, quantity) => {
  mode = mode || 'payment'
  quantity = quantity || 1

  let result = await s3b_api_call('create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      priceId,
      mode,
      quantity
    })
  })

  return result.id
}

const s3b_handle_result = (result) => {
  if (result.error) alert(result.error.message)
}

const s3_doc_ready = (fn) => {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

s3_doc_ready(s3b_init)
