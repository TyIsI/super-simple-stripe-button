/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { loadStripe } from '@stripe/stripe-js/pure'

import type { S3BHandlerResponse, StripeErrorResult } from './types'

const s3bValidStates = ['complete', 'interactive']

export async function s3bApiCall<T = unknown>(
    rpc: string,
    params?: RequestInit | null
): Promise<T> {
    if (window.S3B == null) throw new Error('S3B not initialized')

    const requestUri = `${window.S3B.siteurl}/wp-content/plugins/super-simple-stripe-button/handler.php?cmd=${rpc}`

    const requestResult =
        params != null
            ? await fetch(requestUri, params)
            : await fetch(requestUri)

    const requestData = (await requestResult.json()) as S3BHandlerResponse<T>

    if (requestData.result === 'ERROR')
        throw new Error(`API Error: ${requestData.message}`)

    return requestData.data
}

export async function s3bInit(): Promise<void> {
    console.log('Fetching Stripe key')
    const keyResult = await s3bApiCall<string>('get-stripe-key')

    window.S3B.Stripe = await loadStripe(keyResult)

    await s3bAttachListeners()
}

export async function s3bButtonListener(self: HTMLElement): Promise<void> {
    if (window.S3B == null) throw new Error('S3B not initialized')
    if (window.S3B.Stripe == null) throw new Error('Stripe not initialized')

    const priceId = jQuery(self).data('price-id') as string
    const quantity = Number(jQuery(self).data('quantity') ?? 1)
    const mode = jQuery(self).data('mode') as string

    console.log('s3bCreateCheckoutSession', priceId, mode, quantity)
    const sessionId = await s3bCreateCheckoutSession(priceId, mode, quantity)

    console.log('s3bCreateCheckoutSession', 'sessionId', sessionId)

    const redirectResult = await window.S3B.Stripe.redirectToCheckout({
        sessionId
    })
    if (redirectResult != null) await s3bHandleResult(redirectResult)
}

const s3bAttachListeners = async (): Promise<void> => {
    jQuery('.s3b-button').on('click', (e) => {
        void s3bButtonListener(e.target)
    })
}

export async function s3bCreateCheckoutSession(
    priceId: string,
    mode: string,
    quantity: string | number
): Promise<string> {
    mode = mode ?? 'payment'
    quantity = quantity ?? 1

    const result = await s3bApiCall<{ id: string }>('create-checkout-session', {
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

export async function s3bHandleResult(
    result: StripeErrorResult | undefined
): Promise<void> {
    if (result?.error != null) alert(result.error.message)
}

export function s3bDocReady(initializer: () => Promise<void>): void {
    s3bValidStates.includes(document.readyState)
        ? setTimeout(initializer, 1)
        : document.addEventListener('DOMContentLoaded', () => {
              void initializer()
          })
}

s3bDocReady(s3bInit)
