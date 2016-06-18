# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('v0', '0024_auto_20160602_1135'),
    ]

    operations = [
        migrations.CreateModel(
            name='CampaignInventoryPrice',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, db_column='ID')),
                ('master_factor', models.IntegerField(null=True, db_column='MASTER_FACTOR')),
                ('business_price', models.IntegerField(null=True, db_column='BUSINESS_PRICE')),
                ('campaign', models.ForeignKey(related_name='campaign', db_column='CAMPAIGN_ID', to='v0.Campaign', null=True)),
                ('supplier', models.ForeignKey(related_name='inventoryprice', null=True, db_column='SUPPLIER_ID', blank=True, to='v0.SupplierTypeSociety', unique=True)),
            ],
            options={
                'db_table': 'campaign_inventory_price',
            },
        ),
        migrations.CreateModel(
            name='CampaignOtherCost',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, db_column='ID')),
                ('content_dev_cost', models.IntegerField(null=True, db_column='CONTENT_DEV_COST')),
                ('pm_cost', models.IntegerField(null=True, db_column='PROJECT_MGMT_COST')),
                ('data_analytics', models.IntegerField(null=True, db_column='DATA_ANALYTICS')),
                ('printing_cost', models.IntegerField(null=True, db_column='PRINTING_COST')),
                ('digital_camp_cost', models.IntegerField(null=True, db_column='DIGITAL_CAMP_COST')),
                ('campaign', models.ForeignKey(related_name='campaign_cost', db_column='CAMPAIGN_ID', to='v0.Campaign', null=True)),
            ],
            options={
                'db_table': 'campaign_other_cost',
            },
        ),
        migrations.AddField(
            model_name='userprofile',
            name='corporate_form_access',
            field=models.BooleanField(default=False, db_column='corporate_form_access'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='society_form_access',
            field=models.BooleanField(default=False, db_column='society_form_access'),
        ),
    ]
