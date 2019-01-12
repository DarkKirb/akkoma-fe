/* eslint-env browser */
const LOGIN_URL = '/api/account/verify_credentials.json'
const FRIENDS_TIMELINE_URL = '/api/statuses/friends_timeline.json'
const ALL_FOLLOWING_URL = '/api/qvitter/allfollowing'
const PUBLIC_TIMELINE_URL = '/api/statuses/public_timeline.json'
const PUBLIC_AND_EXTERNAL_TIMELINE_URL = '/api/statuses/public_and_external_timeline.json'
const TAG_TIMELINE_URL = '/api/statusnet/tags/timeline'
const FAVORITE_URL = '/api/favorites/create'
const UNFAVORITE_URL = '/api/favorites/destroy'
const RETWEET_URL = '/api/statuses/retweet'
const UNRETWEET_URL = '/api/statuses/unretweet'
const STATUS_UPDATE_URL = '/api/statuses/update.json'
const STATUS_DELETE_URL = '/api/statuses/destroy'
const STATUS_URL = '/api/statuses/show'
const MEDIA_UPLOAD_URL = '/api/statusnet/media/upload'
const CONVERSATION_URL = '/api/statusnet/conversation'
const MENTIONS_URL = '/api/statuses/mentions.json'
const DM_TIMELINE_URL = '/api/statuses/dm_timeline.json'
const FOLLOWERS_URL = '/api/statuses/followers.json'
const FRIENDS_URL = '/api/statuses/friends.json'
const FOLLOWING_URL = '/api/friendships/create.json'
const UNFOLLOWING_URL = '/api/friendships/destroy.json'
const QVITTER_USER_PREF_URL = '/api/qvitter/set_profile_pref.json'
const REGISTRATION_URL = '/api/account/register.json'
const AVATAR_UPDATE_URL = '/api/qvitter/update_avatar.json'
const BG_UPDATE_URL = '/api/qvitter/update_background_image.json'
const BANNER_UPDATE_URL = '/api/account/update_profile_banner.json'
const PROFILE_UPDATE_URL = '/api/account/update_profile.json'
const EXTERNAL_PROFILE_URL = '/api/externalprofile/show.json'
const QVITTER_USER_TIMELINE_URL = '/api/qvitter/statuses/user_timeline.json'
const QVITTER_USER_NOTIFICATIONS_URL = '/api/qvitter/statuses/notifications.json'
const QVITTER_USER_NOTIFICATIONS_READ_URL = '/api/qvitter/statuses/notifications/read.json'
const BLOCKING_URL = '/api/blocks/create.json'
const UNBLOCKING_URL = '/api/blocks/destroy.json'
const USER_URL = '/api/users/show.json'
const FOLLOW_IMPORT_URL = '/api/pleroma/follow_import'
const DELETE_ACCOUNT_URL = '/api/pleroma/delete_account'
const CHANGE_PASSWORD_URL = '/api/pleroma/change_password'
const FOLLOW_REQUESTS_URL = '/api/pleroma/friend_requests'
const APPROVE_USER_URL = '/api/pleroma/friendships/approve'
const DENY_USER_URL = '/api/pleroma/friendships/deny'
const SUGGESTIONS_URL = '/api/v1/suggestions'

const MASTODON_USER_FAVORITES_TIMELINE_URL = '/api/v1/favourites'

import { each, map } from 'lodash'
import 'whatwg-fetch'

const oldfetch = window.fetch

let fetch = (url, options) => {
  options = options || {}
  const baseUrl = ''
  const fullUrl = baseUrl + url
  options.credentials = 'same-origin'
  return oldfetch(fullUrl, options)
}

// Params
// cropH
// cropW
// cropX
// cropY
// img (base 64 encodend data url)
const updateAvatar = ({credentials, params}) => {
  let url = AVATAR_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const updateBg = ({credentials, params}) => {
  let url = BG_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params
// height
// width
// offset_left
// offset_top
// banner (base 64 encodend data url)
const updateBanner = ({credentials, params}) => {
  let url = BANNER_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params
// name
// url
// location
// description
const updateProfile = ({credentials, params}) => {
  let url = PROFILE_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    /* Always include description, no_rich_text and locked, because it might be empty or false */
    if (key === 'description' || key === 'locked' || key === 'no_rich_text' || value) {
      form.append(key, value)
    }
  })
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params needed:
// nickname
// email
// fullname
// password
// password_confirm
//
// Optional
// bio
// homepage
// location
// token
const register = (params) => {
  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })

  return fetch(REGISTRATION_URL, {
    method: 'POST',
    body: form
  })
}

const getCaptcha = () => fetch('/api/pleroma/captcha').then(resp => resp.json())

const authHeaders = (accessToken) => {
  if (accessToken) {
    return { 'Authorization': `Bearer ${accessToken}` }
  } else {
    return { }
  }
}

const externalProfile = ({profileUrl, credentials}) => {
  let url = `${EXTERNAL_PROFILE_URL}?profileurl=${profileUrl}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const followUser = ({id, credentials}) => {
  let url = `${FOLLOWING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unfollowUser = ({id, credentials}) => {
  let url = `${UNFOLLOWING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const blockUser = ({id, credentials}) => {
  let url = `${BLOCKING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unblockUser = ({id, credentials}) => {
  let url = `${UNBLOCKING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const approveUser = ({id, credentials}) => {
  let url = `${APPROVE_USER_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const denyUser = ({id, credentials}) => {
  let url = `${DENY_USER_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const fetchUser = ({id, credentials}) => {
  let url = `${USER_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFriends = ({id, credentials}) => {
  let url = `${FRIENDS_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFollowers = ({id, credentials}) => {
  let url = `${FOLLOWERS_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchAllFollowing = ({username, credentials}) => {
  const url = `${ALL_FOLLOWING_URL}/${username}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFollowRequests = ({credentials}) => {
  const url = FOLLOW_REQUESTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchConversation = ({id, credentials}) => {
  let url = `${CONVERSATION_URL}/${id}.json?count=100`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchStatus = ({id, credentials}) => {
  let url = `${STATUS_URL}/${id}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const setUserMute = ({id, credentials, muted = true}) => {
  const form = new FormData()

  const muteInteger = muted ? 1 : 0

  form.append('namespace', 'qvitter')
  form.append('data', muteInteger)
  form.append('topic', `mute:${id}`)

  return fetch(QVITTER_USER_PREF_URL, {
    method: 'POST',
    headers: authHeaders(credentials),
    body: form
  })
}

export const statusType = (status) => {
  if (status.is_post_verb) {
    return 'status'
  }

  if (status.retweeted_status) {
    return 'retweet'
  }

  if ((typeof status.uri === 'string' && status.uri.match(/(fave|objectType=Favourite)/)) ||
      (typeof status.text === 'string' && status.text.match(/favorited/))) {
    return 'favorite'
  }

  if (status.text.match(/deleted notice {{tag/) || status.qvitter_delete_notice) {
    return 'deletion'
  }

  if (status.text.match(/started following/) || status.activity_type === 'follow') {
    return 'follow'
  }

  return 'unknown'
}

const isMastoAPI = (status) => {
  return status.hasOwnProperty('account')
}

const parseUser = (data) => {
  return {
    id: data.id,
    screen_name: data.screen_name || data.acct
  }
}

const parseAttachment = (data) => {
  return {
    ...data,
    mimetype: data.mimetype || data.type
  }
}

const parseData = (data) => {
  const output = {}
  const masto = isMastoAPI(data)
  output.raw = data
  output.id = data.id

  output.user = parseUser(masto ? data.account : data.user)

  output.attentions = ((masto ? data.mentions : data.attentions) || []).map(_ => ({
    id: _.id,
    following: _.following // FIXME: MastoAPI doesn't have this
  }))

  // FIXME: Masto doesn't have "raw text" data, using html data...
  output.text = masto ? data.content : data.text

  output.attachments = ((masto ? data.media_attachments : data.attachments) || []).map(parseAttachment)

  const retweetedStatus = masto ? data.reblog : data.retweeted_status
  if (retweetedStatus) {
    output.retweeted_status = parseData(retweetedStatus)
  }

  if (masto) {
    output.type = data.reblog ? 'retweet' : 'status'
    output.nsfw = data.sensitive
    output.statusnet_html = data.content
  } else {
    // catchall, temporary
    Object.assign(output, data)

    // QVitterAPI
    output.type = statusType(data)

    if (data.nsfw === undefined) {
      output.nsfw = isNsfw(data)
      if (data.retweeted_status) {
        output.nsfw = data.retweeted_status.nsfw
      }
    }
  }

  return output
}

const isNsfw = (status) => {
  const nsfwRegex = /#nsfw/i
  return (status.tags || []).includes('nsfw') || !!status.text.match(nsfwRegex)
}

const fetchTimeline = ({timeline, credentials, since = false, until = false, userId = false, tag = false}) => {
  const timelineUrls = {
    public: PUBLIC_TIMELINE_URL,
    friends: FRIENDS_TIMELINE_URL,
    mentions: MENTIONS_URL,
    dms: DM_TIMELINE_URL,
    notifications: QVITTER_USER_NOTIFICATIONS_URL,
    'publicAndExternal': PUBLIC_AND_EXTERNAL_TIMELINE_URL,
    user: QVITTER_USER_TIMELINE_URL,
    favorites: MASTODON_USER_FAVORITES_TIMELINE_URL,
    tag: TAG_TIMELINE_URL
  }

  let url = timelineUrls[timeline.type || timeline]

  let params = []

  if (since) {
    params.push(['since_id', since])
  }
  if (until) {
    params.push(['max_id', until])
  }
  if (userId) {
    params.push(['user_id', userId])
  }
  if (tag) {
    url += `/${tag}.json`
  }

  params.push(['count', 20])

  const queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline')
    })
    .then((data) => data.json())
    .then((data) => data.map(parseData))
}

const verifyCredentials = (user) => {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: authHeaders(user)
  })
}

const favorite = ({ id, credentials }) => {
  return fetch(`${FAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unfavorite = ({ id, credentials }) => {
  return fetch(`${UNFAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const retweet = ({ id, credentials }) => {
  return fetch(`${RETWEET_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unretweet = ({ id, credentials }) => {
  return fetch(`${UNRETWEET_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const postStatus = ({credentials, status, spoilerText, visibility, sensitive, mediaIds, inReplyToStatusId, contentType, noAttachmentLinks}) => {
  const idsText = mediaIds.join(',')
  const form = new FormData()

  form.append('status', status)
  form.append('source', 'Pleroma FE')
  if (noAttachmentLinks) form.append('no_attachment_links', noAttachmentLinks)
  if (spoilerText) form.append('spoiler_text', spoilerText)
  if (visibility) form.append('visibility', visibility)
  if (sensitive) form.append('sensitive', sensitive)
  if (contentType) form.append('content_type', contentType)
  form.append('media_ids', idsText)
  if (inReplyToStatusId) {
    form.append('in_reply_to_status_id', inReplyToStatusId)
  }

  return fetch(STATUS_UPDATE_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
}

const deleteStatus = ({ id, credentials }) => {
  return fetch(`${STATUS_DELETE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const uploadMedia = ({formData, credentials}) => {
  return fetch(MEDIA_UPLOAD_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.text())
    .then((text) => (new DOMParser()).parseFromString(text, 'application/xml'))
}

const followImport = ({params, credentials}) => {
  return fetch(FOLLOW_IMPORT_URL, {
    body: params,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const deleteAccount = ({credentials, password}) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(DELETE_ACCOUNT_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changePassword = ({credentials, password, newPassword, newPasswordConfirmation}) => {
  const form = new FormData()

  form.append('password', password)
  form.append('new_password', newPassword)
  form.append('new_password_confirmation', newPasswordConfirmation)

  return fetch(CHANGE_PASSWORD_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const fetchMutes = ({credentials}) => {
  const url = '/api/qvitter/mutes.json'

  return fetch(url, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const suggestions = ({credentials}) => {
  return fetch(SUGGESTIONS_URL, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const markNotificationsAsSeen = ({id, credentials}) => {
  const body = new FormData()

  body.append('latest_id', id)

  return fetch(QVITTER_USER_NOTIFICATIONS_READ_URL, {
    body,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchConversation,
  fetchStatus,
  fetchFriends,
  fetchFollowers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  fetchUser,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  postStatus,
  deleteStatus,
  uploadMedia,
  fetchAllFollowing,
  setUserMute,
  fetchMutes,
  register,
  getCaptcha,
  updateAvatar,
  updateBg,
  updateProfile,
  updateBanner,
  externalProfile,
  followImport,
  deleteAccount,
  changePassword,
  fetchFollowRequests,
  approveUser,
  denyUser,
  suggestions,
  markNotificationsAsSeen
}

export default apiService
