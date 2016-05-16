"""
Django settings for coreapi project.

Generated by 'django-admin startproject' using Django 1.8.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ewis(omy!u-rgpf%9hp1^3@8ivz!upuwc&tp!0trx%#vjqs!&2'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = 'true'

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_jwt',
    'v0',
    'drf_generators')

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'coreapi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'coreapi.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases


DATABASES = {
    'sqlite': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },

    'default': {
         'NAME':'machadalo',
         'ENGINE': 'django.db.backends.mysql',
         'HOST': '127.0.0.1',
         'USER': 'root',
         'PASSWORD': 'vidhi',
     }
    }


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = '/static/'

# settings for Django Rest Framework

'''REST_FRAMEWORK = {
    # other settings...
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}'''

REST_FRAMEWORK = {
     'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
        ),
     'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_jwt.authentication.JSONWebTokenAuthentication',
        ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}


# CORS headers
CORS_ORIGIN_ALLOW_ALL = True


# Authentication
JWT_AUTH = {
      'JWT_ENCODE_HANDLER':
      'rest_jwt.utils.jwt_encode_handler',

      'JWT_DECODE_HANDLER':
      'rest_jwt.utils.jwt_decode_handler',

      'JWT_PAYLOAD_HANDLER':
      'rest_jwt.utils.myjwt_payload_handler',

      'JWT_PAYLOAD_GET_USER_ID_HANDLER':
      'rest_jwt.utils.jwt_get_user_id_from_payload_handler',

      'JWT_RESPONSE_PAYLOAD_HANDLER':
      'rest_jwt.utils.myjwt_response_payload_handler',

      'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=300),

      'JWT_ALLOW_REFRESH': True,
      'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

      'JWT_VERIFY_EXPIRATION': False,
      }
