from .base import * 

DEBUG = False
ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True

# email
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
SENDGRID_SANDBOX_MODE_IN_DEBUG = False

# Static files
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY") 
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME") 
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL") 
AWS_S3_OBJECT_PARAMETERS = { 
    'CacheControl': 'max-age=86400', 
} 

AWS_DEFAULT_ACL = 'public-read'
AWS_S3_SIGNATURE_VERSION = 's3v4'

STATIC_URL = 'https://%s/%s/' % (AWS_S3_ENDPOINT_URL, 'staticfiles')
MEDIA_URL =  'https://%s/%s/' % (AWS_S3_ENDPOINT_URL, 'mediafiles')

STATICFILES_STORAGE =  'server.settings.custom_storages.StaticStorage'
DEFAULT_FILE_STORAGE = 'server..settingscustom_storages.MediaStorage'
