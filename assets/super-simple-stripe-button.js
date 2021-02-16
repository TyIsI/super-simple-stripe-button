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
  if (params !== undefined || params !== null) {
    let requestUri =
      '/wp-content/plugins/super-simple-stripe-button/handler.php/' + rpc

    let requestResult = await fetch(requestUri)

    let requestData = await requestResult.json()

    return requestData.data
  }
}

const s3b_init = async () => {
  console.log('Fetching Stripe key')
  let keyResult = await fetch(
    '/wp-content/plugins/super-simple-stripe-button/handler.php/get-stripe-key'
  )

  JSONKeyResult = await keyResult.json()

  window.s3b_stripe = Stripe(JSONKeyResult.data)

  s3b_attach_listeners()
}

const s3b_button_listener = async function () {
  let priceId = $(this).data('price-id')
  let quantity = $(this).data('quantity') || 1
  let mode = $(this).data('mode')

  let sessionId = await s3b_create_checkout_session(priceId, mode, quantity)

  window.s3b_stripe
    .redirectToCheckout({
      sessionId
    })
    .then(s3b_handle_result)
}

const s3b_attach_listeners = async (stripe) => {
  $('.s3b-button').on('click', s3b_button_listener)
}

const s3b_create_checkout_session = async (priceId, mode, quantity) => {
  mode = mode || 'payment'
  quantity = quantity || 1

  let rawResult = await fetch(
    '/wp-content/plugins/super-simple-stripe-button/handler.php/create-checkout-session',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId,
        mode,
        quantity
      })
    }
  )

  let JSONResult = await rawResult.json()

  JSONResult = JSONResult.data

  return JSONResult.id
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
