/* eslint-disable @typescript-eslint/naming-convention */

import type { Stripe, StripeError } from '@stripe/stripe-js'

interface S3B {
    siteurl: string
    Stripe?: Stripe | null
}

declare global {
    interface Window {
        S3B: S3B
    }
}

export interface S3BBaseHandlerErrorResponse {
    result: 'ERROR'
    message: string
}

export interface S3BBaseHandlerSuccessResponse<T> {
    result: 'OK'
    message: 'Success'
    data: T
}

export type S3BHandlerResponse<T> =
    | S3BBaseHandlerErrorResponse
    | S3BBaseHandlerSuccessResponse<T>

export interface StripeErrorResult {
    error: StripeError
}
