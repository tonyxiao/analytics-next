import { Event, Property, TrackingPlan } from '..'
import { AnalyticsUser } from '../analytics-user'

export type Events =
  | Event<'Workspace Created', { workspaceId: string }>
  | Event<'Payment Failed', {}>
  | Event<'Payment Succeeded', {}>
  | Event<'Period Began', {}>
  | Event<'Notification Received', {}>
  | Event<'User Signed Up', {}>
  | Event<'User Login', {}>
  | 'Email Sent'
  | 'Transaction Created'
  | 'Transaction Finished'
  | 'Bug Reported'

export type Traits = Property<'email', string> &
  Property<'phone', string> &
  Property<'firstName', string> &
  Property<'createdAt', Date>

export const trackingPlan: TrackingPlan<Events, Traits> = {}
