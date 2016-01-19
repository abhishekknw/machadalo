# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db import models

AD_INVENTORY_CHOICES = (
    ('POSTER', 'Poster'),
    ('STANDEE', 'Standee'),
    ('STALL', 'Stall'),
    ('BANNER', 'Banner'),
)


class ImageMapping(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    location_id = models.CharField(db_column='LOCATION_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    location_type = models.CharField(db_column='LOCATION_TYPE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='images', blank=True, null=True)
    image_url = models.CharField(db_column='IMAGE_URL', max_length=100)
    comments = models.CharField(db_column='COMMENTS', max_length=100, blank=True, null=True)
    name = models.CharField(db_column='NAME', max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'image_mapping'


class InventoryLocation(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field n
    location_id = models.CharField(db_column='LOCATION_ID', max_length=20)  # Field name made lowercase.
    location_type = models.CharField(db_column='LOCATION_TYPE', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'inventory_location'


class AdInventoryLocationMapping(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20)  # Field name made lowercase.
    adinventory_name = models.CharField(db_column='ADINVENTORY_NAME', max_length=10,
                                        choices=AD_INVENTORY_CHOICES, default='POSTER')  # Field name made lowercase.
    location = models.ForeignKey('InventoryLocation', db_column='INVENTORY_LOCATION_ID', related_name='inventory_locations', blank=True, null=True)

    def save(self, *args, **kwargs):
        super(AdInventoryLocationMapping, self).save()
        if self.adinventory_name == 'POSTER':
            ad_type = AdInventoryType.objects.filter(adinventory_name=self.adinventory_name)
        else:
            ad_type = AdInventoryType.objects.filter(adinventory_name=self.adinventory_name, adinventory_type=args[0]) #add type = stall/standee.type
        print 'adele' + args[0]
        default_prices = PriceMappingDefault.objects.filter(adinventory_type__in=ad_type, supplier=args[1])

        for key in default_prices:
            print "in def"
            pm = PriceMapping(adinventory_id = self, adinventory_type=key.adinventory_type,
                              society_price = key.society_price, business_price=key.business_price,
                              duration_type = key.duration_type, supplier=key.supplier)
            pm.save()

    class Meta:
        db_table = 'ad_inventory_location_mapping'






'''@receiver(post_save, sender=AdInventoryLocationMapping)
def update_price_mapping(sender, **kwargs):
    loc_map = kwargs.get('instance')
    type1 = kwargs.get('type')
    print type1
    print str(loc_map)
    if loc_map.adinventory_name == 'PO':
        ad_type = AdInventoryType.objects.filter(adinventory_name=loc_map.adinventory_name)
    else:
        ad_type = AdInventoryType.objects.filter(adinventory_name=loc_map.adinventory_name) #add type = stall/standee.type
    print 'adele'
    default_prices = PriceMappingDefault.objects.filter(adinventory_type__in=ad_type)
    for key in default_prices:
        pm = PriceMapping(adinventory_id = loc_map, adinventory_type=key.adinventory_type,
                          society_price = key.society_price, business_price=key.business_price,
                          duration_type = key.duration_type, supplier=key.supplier)
        pm.save()


'''



class AdInventoryType(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    adinventory_name = models.CharField(db_column='ADINVENTORY_NAME', max_length=10,
                                        choices=AD_INVENTORY_CHOICES, default='POSTER')
    adinventory_type = models.CharField(db_column='ADINVENTORY_TYPE', max_length=20)  # Field name made lowercase.

    class Meta:
        db_table = 'ad_inventory_type'


class DurationType(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    duration_name = models.CharField(db_column='DURATION_NAME', max_length=20)  # Field name made lowercase.
    days_count = models.IntegerField(db_column='DAYS_COUNT')  # Field name made lowercase.

    class Meta:
        db_table = 'duration_type'


class PriceMappingDefault(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='default_prices', blank=True, null=True)
    #adinventory_id = models.ForeignKey('AdInventoryLocationMapping', db_column='ADINVENTORY_LOCATION_MAPPING_ID', related_name='prices', blank=True, null=True)
    adinventory_type = models.ForeignKey('AdInventoryType', db_column='ADINVENTORY_TYPE_ID', blank=True, null=True)
    society_price = models.IntegerField(db_column='SOCIETY_PRICE')
    business_price = models.IntegerField(db_column='BUSINESS_PRICE')
    duration_type = models.ForeignKey('DurationType', db_column='DURATION_ID', blank=True, null=True)
    class Meta:
        db_table = 'price_mapping_default'



class PriceMapping(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='inv_prices', blank=True, null=True)
    adinventory_id = models.ForeignKey('AdInventoryLocationMapping', db_column='ADINVENTORY_LOCATION_MAPPING_ID', related_name='prices', blank=True, null=True)
    adinventory_type = models.ForeignKey('AdInventoryType', db_column='ADINVENTORY_TYPE_ID', blank=True, null=True)
    society_price = models.IntegerField(db_column='SOCIETY_PRICE')
    business_price = models.IntegerField(db_column='BUSINESS_PRICE')
    duration_type = models.ForeignKey('DurationType', db_column='DURATION_ID', blank=True, null=True)
    class Meta:
        db_table = 'price_mapping'



class BannerInventory(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='banners', blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True)  # Field name made lowercase.
    type = models.CharField(db_column='BANNER_TYPE', max_length=20, blank=True)  # Field name made lowercase.
    banner_location = models.CharField(db_column='BANNER_DISPLAY_LOCATION', max_length=50, blank=True)  # Field name made lowercase.
    banner_size = models.CharField(db_column='BANNER_SIZE', max_length=10, blank=True)  # Field name made lowercase.
    inventory_status = models.CharField(db_column='INVENTORY_STATUS', blank=True,  max_length=15)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True)  # Field name made lowercase.

    class Meta:

        db_table = 'banner_inventory'


class CarDisplayInventory(models.Model):
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    car_display_location = models.CharField(db_column='CAR_DISPLAY_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    car_display_location_size = models.CharField(db_column='CAR_DISPLAY_LOCATION_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    car_daily_price_society = models.FloatField(db_column='CAR_DAILY_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    car_daily_price_business = models.FloatField(db_column='CAR_DAILY_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    car_display_inventory_status = models.CharField(db_column='CAR_DISPLAY_INVENTORY_STATUS', max_length=20, blank=True, null=True)  # Field name made lowercase.
    car_display_type = models.CharField(db_column='CAR_DISPLAY_TYPE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='car_displays', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'car_display_inventory'


class CommunityHallInfo(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='community_halls', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    size_length = models.FloatField(db_column='SIZE_LENGTH', default=0.0, blank=True, null=True)  # Field name made lowercase.
    size_breadth = models.FloatField(db_column='SIZE_BREADTH', default=0.0, blank=True, null=True)  # Field name made lowercase.
    ceiling_height = models.FloatField(db_column='CEILING_HEIGHT', default=0.0, blank=True, null=True)  # Field name made lowercase.
    timings_open = models.TimeField(db_column='TIMINGS_OPEN', blank=True, null=True)  # Field name made lowercase.
    timings_close = models.TimeField(db_column='TIMINGS_CLOSE', blank=True, null=True)  # Field name made lowercase.
    rentals_current = models.FloatField(db_column='RENTALS_CURRENT', default=0.0, blank=True, null=True)  # Field name made lowercase.
    daily_price_society = models.FloatField(db_column='DAILY_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    daily_price_business = models.FloatField(db_column='DAILY_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    location = models.CharField(db_column='LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    furniture_available = models.CharField(db_column='FURNITURE_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    chair_count = models.IntegerField(db_column='CHAIR_COUNT', blank=True, null=True)  # Field name made lowercase.
    tables_count = models.IntegerField(db_column='TABLES_COUNT', blank=True, null=True)  # Field name made lowercase.
    air_conditioned = models.CharField(db_column='AIR_CONDITIONED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    projector_available = models.CharField(db_column='PROJECTOR_AVAILABLE', max_length=15, blank=True, null=True)  # Field name made lowercase.
    inventory_status = models.CharField(db_column='INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    sitting = models.IntegerField(db_column='SITTING', blank=True, null=True)  # Field name made lowercase.
    audio_video_display_available = models.CharField(db_column='AUDIO_VIDEO_DISPLAY_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    electricity_charges_perhour = models.FloatField(db_column='ELECTRICITY_CHARGES_PERHOUR',default=0.0, blank=True, null=True)  # Field name made lowercase.
    notice_board_count_per_community_hall = models.IntegerField(db_column='NOTICE_BOARD_COUNT_PER_COMMUNITY_HALL', blank=True, null=True)  # Field name made lowercase.
    standee_location_count_per_community_hall = models.IntegerField(db_column='STANDEE_LOCATION_COUNT_PER_COMMUNITY_HALL', blank=True, null=True)  # Field name made lowercase.
    stall_count_per_community_hall = models.IntegerField(db_column='STALL_COUNT_PER_COMMUNITY_HALL', blank=True, null=True)  # Field name made lowercase.
    banner_count_per_community_hall = models.IntegerField(db_column='BANNER_COUNT_PER_COMMUNITY_HALL', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'community_hall_info'


class DoorToDoorInfo(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='door_to_doors', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    flier_distribution_frequency_door = models.CharField(db_column='FLIER_DISTRIBUTION_FREQUENCY_DOOR', max_length=20, blank=True, null=True)  # Field name made lowercase.
    door_to_door_inventory_status = models.CharField(db_column='DOOR_TO_DOOR_INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    door_to_door_price_society = models.FloatField(db_column='DOOR_TO_DOOR_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    door_to_door_price_business = models.FloatField(db_column='DOOR_TO_DOOR_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    master_door_to_door_flyer_price_society = models.FloatField(db_column='MASTER_DOOR_TO_DOOR_FLYER_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    master_door_to_door_flyer_price_business = models.FloatField(db_column='MASTER_DOOR_TO_DOOR_FLYER_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    leaflet_handover = models.CharField(db_column='LEAFLET_HANDOVER', max_length=5, blank=True, null=True)  # Field name made lowercase.
    activities = models.CharField(db_column='ACTIVITIES', max_length=255, blank=True, null=True)  # Field name made lowercase.
    banner_spaces_count = models.IntegerField(db_column='BANNER_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'door_to_door_info'


class LiftDetails(models.Model):
    lift_tag = models.CharField(db_column='LIFT_TAG', max_length=20, blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    acrylic_board_available = models.CharField(db_column='ACRYLIC_BOARD_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    lift_location = models.CharField(db_column='LIFT_LOCATION', max_length=100, blank=True, null=True)  # Field name made lowercase.
    total_poster_per_lift = models.IntegerField(db_column='TOTAL_POSTER_PER_LIFT', blank=True, null=True)  # Field name made lowercase.
    lift_lit = models.CharField(db_column='LIFT_LIT', max_length=5, blank=True, null=True)  # Field name made lowercase.
    lift_bubble_wrapping_allowed = models.CharField(db_column='LIFT_BUBBLE_WRAPPING_ALLOWED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    lift_advt_walls_count = models.IntegerField(db_column='LIFT_ADVT_WALLS_COUNT', blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.
    tower = models.ForeignKey('SocietyTower', related_name='lifts', db_column='TOWER_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'lift_details'


class NoticeBoardDetails(models.Model):
    notice_board_tag = models.CharField(db_column='NOTICE_BOARD_TAG',max_length=20, blank=True, null=True )  # Field name made lowercase.
    notice_board_type = models.CharField(db_column='NOTICE_BOARD_TYPE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    notice_board_type_other = models.CharField(db_column='NOTICE_BOARD_TYPE_OTHER', max_length=30, blank=True, null=True)  # Field name made lowercase.
    notice_board_location = models.CharField(db_column='NOTICE_BOARD_LOCATION', max_length=100, blank=True, null=True)  # Field name made lowercase.
    total_poster_per_notice_board = models.IntegerField(db_column='TOTAL_POSTER_PER_NOTICE_BOARD', blank=True, null=True)  # Field name made lowercase.
    poster_location_notice_board = models.CharField(db_column='POSTER_LOCATION_NOTICE_BOARD', max_length=5, blank=True, null=True)  # Field name made lowercase.
    notice_board_lit = models.CharField(db_column='NOTICE_BOARD_LIT', max_length=1, blank=True, null=True)  # Field name made lowercase.
    tower = models.ForeignKey('SocietyTower', related_name='notice_boards', db_column='TOWER_ID', blank=True, null=True)  # Field name made lowercase.
    notice_board_size_length = models.FloatField(db_column='NOTICE_BOARD_SIZE_length', default=0.0, blank=True, null=True)  # Field name made lowercase.
    notice_board_size_breadth = models.FloatField(db_column='NOTICE_BOARD_SIZE_BREADTH', default=0.0, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'notice_board_details'


class PosterInventory(models.Model):
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', primary_key=True, max_length=20)  # Field name made lowercase.
    notice_board_id = models.CharField(db_column='NOTICE_BOARD_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    poster_location = models.CharField(db_column='POSTER_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    poster_area = models.CharField(db_column='POSTER_AREA', max_length=10, blank=True, null=True)  # Field name made lowercase.
    #poster_weekly_price_society = models.CharField(db_column='POSTER_WEEKLY_PRICE_SOCIETY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #poster_monthly_price_society = models.CharField(db_column='POSTER_MONTHLY_PRICE_SOCIETY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #poster_weekly_price_business = models.CharField(db_column='POSTER_WEEKLY_PRICE_BUSINESS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #poster_monthly_price_business = models.CharField(db_column='POSTER_MONTHLY_PRICE_BUSINESS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    inventory_status = models.CharField(db_column='INVENTORY_STATUS', max_length=20, blank=True, null=True)  # Field name made lowercase.
    poster_count_per_notice_board = models.IntegerField(db_column='POSTER_COUNT_PER_NOTICE_BOARD', blank=True, null=True)  # Field name made lowercase.
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=255, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'poster_inventory'


class SocietyFlat(models.Model):
    flat_tag = models.CharField(db_column='FLAT_TAG',max_length=20, blank=True, null=True)  # Field name made lowercase.
    tower = models.ForeignKey('SocietyTower', related_name='flats', db_column='TOWER_ID', blank=True, null=True)  # Field name made lowercase.
    flat_type = models.CharField(db_column='FLAT_TYPE', max_length=20)  # Field name made lowercase.
    flat_count = models.IntegerField(db_column='FLAT_COUNT', blank=True, null=True)  # Field name made lowercase.
    flat_type_count = models.IntegerField(db_column='FLAT_TYPE_COUNT', blank=True, null=True)  # Field name made lowercase.
    flat_size_per_sq_feet_carpet_area = models.FloatField(db_column='FLAT_SIZE_PER_SQ_FEET_CARPET_AREA', blank=True, null=True, default=0.0)  # Field name made lowercase.
    flat_size_per_sq_feet_builtup_area = models.FloatField(db_column='FLAT_SIZE_PER_SQ_FEET_BUILTUP_AREA', blank=True, null=True, default=0.0)  # Field name made lowercase.
    flat_rent = models.IntegerField(db_column='FLAT_RENT', blank=True, null=True)  # Field name made lowercase.
    rent_per_sqft = models.IntegerField(db_column='RENT_PER_SQFT', blank=True, null=True)  # Field name made lowercase.
    average_rent_pers_sqft_tower = models.IntegerField(db_column='AVERAGE_RENT_PERS_SQFT_TOWER', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'society_flat'
        unique_together = (('tower', 'flat_type'),)


class StandeeInventory(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    inventory_status = models.CharField(db_column='INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    standee_location = models.CharField(db_column='STANDEE_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    type = models.CharField(db_column='STANDEE_TYPE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    standee_size = models.CharField(db_column='STANDEE_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    standee_sides = models.CharField(db_column='STANDEE_SIDES', max_length=10, blank=True, null=True)  # Field name made lowercase.
    #standee_weekly_price_society = models.CharField(db_column='STANDEE_WEEKLY_PRICE_SOCIETY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #standee_monthly_price_society = models.CharField(db_column='STANDEE_MONTHLY_PRICE_SOCIETY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #standee_weekly_price_business = models.CharField(db_column='STANDEE_WEEKLY_PRICE_BUSINESS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #standee_monthly_price_business = models.CharField(db_column='STANDEE_MONTHLY_PRICE_BUSINESS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    standee_location_in_tower = models.CharField(db_column='STANDEE_LOCATION_IN_TOWER', max_length=50, blank=True, null=True)  # Field name made lowercase.
    standee_inventory_status = models.TextField(db_column='STANDEE_INVENTORY_STATUS', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    sides = models.CharField(db_column='SIDES', max_length=255, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='standees', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'standee_inventory'


class SwimmingPoolInfo(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='swimming_pools', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    size_breadth = models.FloatField(db_column='SIZE_BREADTH', default=0.0, blank=True, null=True)  # Field name made lowercase.
    size_length = models.FloatField(db_column='SIZE_LENGTH', default=0.0, blank=True, null=True)  # Field name made lowercase.
    side_area = models.FloatField(db_column='SIDE_AREA', default=0.0, blank=True, null=True)  # Field name made lowercase.
    side_rentals = models.CharField(db_column='SIDE_RENTALS', max_length=10, blank=True, null=True)  # Field name made lowercase.
    timings_open = models.TimeField(db_column='TIMINGS_OPEN', blank=True, null=True)  # Field name made lowercase.
    timings_close = models.TimeField(db_column='TIMINGS_CLOSE', blank=True, null=True)  # Field name made lowercase.
    daily_price_society = models.FloatField(db_column='DAILY_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    daily_price_business = models.FloatField(db_column='DAILY_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    location = models.CharField(db_column='LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    notice_board_count_per_swimming_pool = models.IntegerField(db_column='NOTICE_BOARD_COUNT_PER_SWIMMING_POOL', blank=True, null=True)  # Field name made lowercase.
    standee_location_count_per_swimming_pool = models.IntegerField(db_column='STANDEE_LOCATION_COUNT_PER_SWIMMING_POOL', blank=True, null=True)  # Field name made lowercase.
    stall_count_per_swimming_pool = models.IntegerField(db_column='STALL_COUNT_PER_SWIMMING_POOL', blank=True, null=True)  # Field name made lowercase.
    banner_count_per_swimming_pool = models.IntegerField(db_column='BANNER_COUNT_PER_SWIMMING_POOL', blank=True, null=True)  # Field name made lowercase.
    sitting = models.IntegerField(db_column='SITTING', blank=True, null=True)  # Field name made lowercase.
    inventory_status = models.CharField(db_column='INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    audio_video_display_available = models.CharField(db_column='AUDIO_VIDEO_DISPLAY_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    electricity_charges_perhour = models.IntegerField(db_column='ELECTRICITY_CHARGES_PERHOUR', blank=True, null=True)  # Field name made lowercase.
    changing_room_available = models.CharField(db_column='CHANGING_ROOM_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    lit_unlit = models.CharField(db_column='LIT_UNLIT', max_length=5, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'swimming_pool_info'


class WallInventory(models.Model):
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=20, blank=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20)  # Field name made lowercase.
    wall_size = models.CharField(db_column='WALL_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    wall_frame_size = models.CharField(db_column='WALL_FRAME_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    wall_area = models.CharField(db_column='WALL_AREA', max_length=10, blank=True, null=True)  # Field name made lowercase.
    wall_type = models.CharField(db_column='WALL_TYPE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    wall_internal_external = models.CharField(db_column='WALL_INTERNAL_EXTERNAL', max_length=10, blank=True, null=True)  # Field name made lowercase.
    wall_sides = models.CharField(db_column='WALL_SIDES', max_length=10, blank=True, null=True)  # Field name made lowercase.
    wall_monthly_price_society = models.FloatField(db_column='WALL_MONTHLY_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    wall_quarterly_price_society = models.FloatField(db_column='WALL_QUARTERLY_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    wall_monthly_price_business = models.FloatField(db_column='WALL_MONTHLY_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    wall_quarterly_price_business = models.FloatField(db_column='WALL_QUARTERLY_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    wall_location = models.CharField(db_column='WALL_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    wall_paint_allowed = models.CharField(db_column='WALL_PAINT_ALLOWED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    wall_frame_status = models.CharField(db_column='WALL_FRAME_STATUS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    wall_inventory_status = models.CharField(db_column='WALL_INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='walls', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'wall_inventory'


class UserInquiry(models.Model):
    inquiry_id = models.AutoField(db_column='INQUIRY_ID', primary_key=True)  # Field name made lowercase.
    company_name = models.CharField(db_column='COMPANY_NAME', max_length=40)  # Field name made lowercase.
    contact_person_name = models.CharField(db_column='CONTACT_PERSON_NAME', max_length=40, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='EMAIL', max_length=40, blank=True, null=True)  # Field name made lowercase.
    phone = models.IntegerField(db_column='PHONE', blank=True, null=True)  # Field name made lowercase.
    inquiry_details = models.TextField(db_column='INQUIRY_DETAILS')  # Field name made lowercase.

    class Meta:

        db_table = 'user_inquiry'


class CommonAreaDetails(models.Model):
    common_area_id = models.CharField(db_column='COMMON_AREA_ID', primary_key=True, max_length=20)  # Field name made lowercase.
    pole_count = models.IntegerField(db_column='POLE_COUNT', blank=True, null=True)  # Field name made lowercase.
    street_furniture_count = models.IntegerField(db_column='STREET_FURNITURE_COUNT', blank=True, null=True)  # Field name made lowercase.
    banner_count = models.IntegerField(db_column='BANNER_COUNT', blank=True, null=True)  # Field name made lowercase.
    common_area_stalls_count = models.IntegerField(db_column='COMMON_AREA_STALLS_COUNT', blank=True, null=True)  # Field name made lowercase.
    car_display = models.IntegerField(db_column='CAR_DISPLAY', blank=True, null=True)  # Field name made lowercase.
    wall_count = models.IntegerField(db_column='WALL_COUNT', blank=True, null=True)  # Field name made lowercase.
    major_event_count = models.IntegerField(db_column='MAJOR_EVENT_COUNT', blank=True, null=True)  # Field name made lowercase.
    supplier_id = models.CharField(db_column='SUPPLIER_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'common_area_details'


class ContactDetails(models.Model):
    id = models.AutoField(db_column='CONTACT_ID', primary_key=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='contacts', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    contact_type = models.CharField(db_column='CONTACT_TYPE',  max_length=30, blank=True, null=True)  # Field name made lowercase.
    specify_others = models.CharField(db_column='SPECIFY_OTHERS',  max_length=50, blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='CONTACT_NAME',  max_length=50, blank=True, null=True)  # Field name made lowercase.
    landline = models.IntegerField(db_column='CONTACT_LANDLINE', blank=True, null=True)  # Field name made lowercase.
    mobile = models.IntegerField(db_column='CONTACT_MOBILE', blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='CONTACT_EMAILID',  max_length=50, blank=True, null=True)  # Field name made lowercase.
    spoc = models.CharField(db_column='SPOC', max_length=5, blank=True, null=True)  # Field name made lowercase.
    contact_authority = models.CharField(db_column='CONTACT_AUTHORITY', max_length=5, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'contact_details'


class Events(models.Model):
    event_id = models.AutoField(db_column='EVENT_ID', primary_key=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='events', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    event_name = models.CharField(db_column='EVENT_NAME', max_length=20, blank=True, null=True)  # Field name made lowercase.
    event_location = models.CharField(db_column='EVENT_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    past_major_events = models.CharField(db_column='PAST_MAJOR_EVENTS', max_length=50, blank=True, null=True)  # Field name made lowercase.
    past_gathering_per_event = models.CharField(db_column='PAST_GATHERING_PER_EVENT', max_length=5, blank=True, null=True)  # Field name made lowercase.
    event_duration = models.IntegerField(db_column='NO_OF_DAYS', blank=True, null=True)  # Field name made lowercase.
    activities = models.CharField(db_column='ACTIVITIES', max_length=50, blank=True, null=True)  # Field name made lowercase.
    stall_spaces_count = models.IntegerField(db_column='STALL_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.
    banner_spaces_count = models.IntegerField(db_column='BANNER_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.
    poster_spaces_count = models.IntegerField(db_column='POSTER_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.
    standee_spaces_count = models.IntegerField(db_column='STANDEE_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.
    event_linked = models.CharField(db_column='EVENT_LINKED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_3 = models.CharField(db_column='PHOTOGRAPH_3', max_length=45, blank=True, null=True)  # Field name made lowercase.
    event_plan_map = models.CharField(db_column='EVENT_PLAN_MAP', max_length=45, blank=True, null=True)  # Field name made lowercase.
    event_status = models.CharField(db_column='EVENT_STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'events'

class InventoryInfo(models.Model):
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', primary_key=True, max_length=20)  # Field name made lowercase.
    inventory_length = models.CharField(db_column='INVENTORY_LENGTH', max_length=10, blank=True, null=True)  # Field name made lowercase.
    inventory_breadth = models.CharField(db_column='INVENTORY_BREADTH', max_length=10, blank=True, null=True)  # Field name made lowercase.
    inventory_height = models.CharField(db_column='INVENTORY_HEIGHT', max_length=10, blank=True, null=True)  # Field name made lowercase.
    inventory_area = models.CharField(db_column='INVENTORY_AREA', max_length=10, blank=True, null=True)  # Field name made lowercase.
    inventory_size = models.CharField(db_column='INVENTORY_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    inventory_name = models.CharField(db_column='INVENTORY_NAME', max_length=70, blank=True, null=True)  # Field name made lowercase.
    comments1 = models.CharField(db_column='COMMENTS1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    comments2 = models.CharField(db_column='COMMENTS2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    material_type = models.CharField(db_column='MATERIAL_TYPE', max_length=70, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'inventory_info'



class MailboxInfo(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    tower_id = models.CharField(db_column='TOWER_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='mail_boxes', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    flier_distribution_frequency = models.CharField(db_column='FLIER_DISTRIBUTION_FREQUENCY', max_length=20, blank=True, null=True)  # Field name made lowercase.
    mail_box_inventory_status = models.CharField(db_column='MAIL_BOX_INVENTORY_STATUS', max_length=20, blank=True, null=True)  # Field name made lowercase.
    mailbox_count_per_tower = models.IntegerField(db_column='MAILBOX_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    mailbox_flyer_price_society = models.FloatField(db_column='MAILBOX_FLYER_PRICE_SOCIETY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    mailbox_flyer_price_business = models.FloatField(db_column='MAILBOX_FLYER_PRICE_BUSINESS', default=0.0, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'mailbox_info'


class OperationsInfo(models.Model):
    operator_id = models.CharField(db_column='OPERATOR_ID', primary_key=True, max_length=10)  # Field name made lowercase.
    operator_name = models.CharField(db_column='OPERATOR_NAME', max_length=100, blank=True, null=True)  # Field name made lowercase.
    operator_email = models.CharField(db_column='OPERATOR_EMAIL', max_length=50, blank=True, null=True)  # Field name made lowercase.
    operator_company = models.CharField(db_column='OPERATOR_COMPANY', max_length=100, blank=True, null=True)  # Field name made lowercase.
    operator_phone_number = models.IntegerField(db_column='OPERATOR_PHONE_NUMBER', blank=True, null=True)  # Field name made lowercase.
    comments_1 = models.CharField(db_column='COMMENTS_1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    comments_2 = models.CharField(db_column='COMMENTS_2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    company_id = models.CharField(db_column='COMPANY_ID', max_length=50, blank=True, null=True)  # Field name made lowercase.
    company_address = models.CharField(db_column='COMPANY_ADDRESS', max_length=250, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'operations_info'


class PoleInventory(models.Model):
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='poles', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    pole_hoarding_size = models.CharField(db_column='POLE_HOARDING_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    pole_area = models.CharField(db_column='POLE_AREA', max_length=10, blank=True, null=True)  # Field name made lowercase.
    pole_hoarding_type = models.CharField(db_column='POLE_HOARDING_TYPE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    pole_lit_status = models.CharField(db_column='POLE_LIT_STATUS',  max_length=5, blank=True)  # Field name made lowercase. This field type is a guess.
    pole_sides = models.CharField(db_column='POLE_SIDES', max_length=10, blank=True, null=True)  # Field name made lowercase.
    pole_monthly_price_society = models.FloatField(db_column='POLE_MONTHLY_PRICE_SOCIETY', null=True)  # Field name made lowercase.
    pole_quarterly_price_society = models.FloatField(db_column='POLE_QUARTERLY_PRICE_SOCIETY', null=True)  # Field name made lowercase.
    pole_monthly_price_business = models.FloatField(db_column='POLE_MONTHLY_PRICE_BUSINESS', null=True)  # Field name made lowercase.
    pole_quarterly_price_business = models.FloatField(db_column='POLE_QUARTERLY_PRICE_BUSINESS', null=True)  # Field name made lowercase.
    pole_location = models.CharField(db_column='POLE_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    pole_inventory_status = models.CharField(db_column='POLE_INVENTORY_STATUS', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'pole_inventory'


class PosterInventoryMapping(models.Model):
    inventory_mapping_id = models.AutoField(db_column='INVENTORY_MAPPING_ID', primary_key=True)  # Field name made lowercase.
    inventory_type_id = models.CharField(db_column='INVENTORY_TYPE_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    poster_adinventory_id = models.CharField(db_column='POSTER_ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    standee_adinventory_id = models.CharField(db_column='STANDEE_ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    banner_adinventory_id = models.CharField(db_column='BANNER_ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    stall_adinventory_id = models.CharField(db_column='STALL_ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'poster_inventory_mapping'


class RatioDetails(models.Model):
    supplier_id = models.CharField(db_column='SUPPLIER_ID', max_length=20)  # Field name made lowercase.
    machadalo_index = models.CharField(db_column='MACHADALO_INDEX', max_length=30)  # Field name made lowercase.
    age_proportions = models.CharField(db_column='AGE_PROPORTIONS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    flat_avg_rental_persqft = models.CharField(db_column='FLAT_AVG_RENTAL_PERSQFT', max_length=10, blank=True, null=True)  # Field name made lowercase.
    flat_avg_size = models.CharField(db_column='FLAT_AVG_SIZE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    flat_sale_cost_persqft = models.CharField(db_column='FLAT_SALE_COST_PERSQFT', max_length=5, blank=True, null=True)  # Field name made lowercase.
    wall_count = models.IntegerField(db_column='WALL_COUNT', blank=True, null=True)  # Field name made lowercase.
    major_event_count = models.IntegerField(db_column='MAJOR_EVENT_COUNT', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'ratio_details'
        unique_together = (('supplier_id', 'machadalo_index'),)


class Signup(models.Model):
    user_id = models.AutoField(db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    first_name = models.TextField(db_column='FIRST_NAME', blank=True, null=True)  # Field name made lowercase.
    email = models.TextField(db_column='EMAIL', blank=True, null=True)  # Field name made lowercase.
    password = models.TextField(db_column='PASSWORD', blank=True, null=True)  # Field name made lowercase.
    login_type = models.TextField(db_column='LOGIN_TYPE', blank=True, null=True)  # Field name made lowercase.
    system_generated_id = models.BigIntegerField(db_column='SYSTEM_GENERATED_ID')  # Field name made lowercase.
    adminstrator_approved = models.CharField(db_column='ADMINSTRATOR_APPROVED', max_length=255, blank=True, null=True)  # Field name made lowercase.
    company_name = models.CharField(db_column='COMPANY_NAME', max_length=255, blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=255, blank=True, null=True)  # Field name made lowercase.
    mobile_no = models.CharField(db_column='MOBILE_NO', max_length=255, blank=True, null=True)  # Field name made lowercase.
    signup_status = models.CharField(db_column='SIGNUP_STATUS', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'signup'


class StallInventory(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    supplier = models.ForeignKey('SupplierTypeSociety', db_column='SUPPLIER_ID', related_name='stalls', blank=True, null=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20)  # Field name made lowercase.
    type = models.CharField(db_column='STALL_TYPES', max_length=20, blank=True, null=True)  # Field name made lowercase.
    stall_timings_morning = models.CharField(db_column='STALL_TIMINGS_morning', max_length=10, blank=True, null=True)  # Field name made lowercase.
    stall_size_area = models.FloatField(db_column='STALL_SIZE_AREA', blank=True, null=True, default=0.0)  # Field name made lowercase.
    #stall_daily_price_stall_society = models.CharField(db_column='STALL_DAILY_PRICE_STALL_SOCIETY', max_length=15, blank=True, null=True)  # Field name made lowercase.
    #stall_daily_price_stall_business = models.CharField(db_column='STALL_DAILY_PRICE_STALL_BUSINESS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    current_price_stall = models.CharField(db_column='Current_Price_Stall', max_length=5, blank=True, null=True)  # Field name made lowercase.
    stall_timings_evening = models.TimeField(db_column='STALL_TIMINGS_evening', blank=True, null=True)  # Field name made lowercase.
    stall_location = models.CharField(db_column='STALL_LOCATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    electricity_available_stalls = models.CharField(db_column='ELECTRICITY_AVAILABLE_STALLS', max_length=50, blank=True, null=True)  # Field name made lowercase.
    electricity_charges_daily = models.CharField(db_column='ELECTRICITY_CHARGES_DAILY', max_length=50, blank=True, null=True)  # Field name made lowercase.
    sound_system_allowed = models.CharField(db_column='SOUND_SYSTEM_ALLOWED', max_length=50, blank=True, null=True)  # Field name made lowercase.
    stall_furniture_available = models.CharField(db_column='STALL_FURNITURE_AVAILABLE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    stall_furniture_details = models.CharField(db_column='STALL_FURNITURE_DETAILS', max_length=50, blank=True, null=True)  # Field name made lowercase.
    stall_inventory_status = models.CharField(db_column='STALL_INVENTORY_STATUS', max_length=15, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'stall_inventory'


class StreetFurniture(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    adinventory_id = models.CharField(db_column='ADINVENTORY_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='street_furniture', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    no_of_furniture = models.IntegerField(db_column='NO_OF_FURNITURE', blank=True, null=True)  # Field name made lowercase.
    type_of_furniture = models.CharField(db_column='TYPE_OF_FURNITURE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)  # Field name made lowercase.
    comment_1 = models.TextField(db_column='COMMENT_1', blank=True, null=True)  # Field name made lowercase.
    comment_2 = models.TextField(db_column='COMMENT_2', blank=True, null=True)  # Field name made lowercase.
    furniture_status = models.CharField(db_column='FURNITURE_STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'street_furniture'


class SupplierInfo(models.Model):
    supplier_id = models.CharField(db_column='SUPPLIER_ID', primary_key=True, max_length=20)  # Field name made lowercase.
    supplier_name = models.CharField(db_column='SUPPLIER_NAME', max_length=30, blank=True, null=True)  # Field name made lowercase.
    supplier_emailid = models.CharField(db_column='SUPPLIER_EMAILID', max_length=100, blank=True, null=True)  # Field name made lowercase.
    supplier_phone_no = models.CharField(db_column='SUPPLIER_PHONE_NO', max_length=15, blank=True, null=True)  # Field name made lowercase.
    supplier_location = models.CharField(db_column='SUPPLIER_LOCATION', max_length=70, blank=True, null=True)  # Field name made lowercase.
    supplier_business_type = models.CharField(db_column='SUPPLIER_BUSINESS_TYPE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    comments_1 = models.CharField(db_column='COMMENTS_1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    comments_2 = models.CharField(db_column='COMMENTS_2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    supplier_address = models.CharField(db_column='SUPPLIER_ADDRESS', max_length=250, blank=True, null=True)  # Field name made lowercase.
    total_inventory = models.CharField(db_column='TOTAL_INVENTORY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    total_inventory_currently_released = models.CharField(db_column='TOTAL_INVENTORY_CURRENTLY_RELEASED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    total_inventory_currently_released_audit = models.CharField(db_column='TOTAL_INVENTORY_CURRENTLY_RELEASED_AUDIT', max_length=5, blank=True, null=True)  # Field name made lowercase.
    pan_id = models.CharField(db_column='PAN_ID', max_length=10, blank=True, null=True)  # Field name made lowercase.
    tan_id = models.CharField(db_column='TAN_ID', max_length=12, blank=True, null=True)  # Field name made lowercase.
    supplier_type = models.CharField(db_column='SUPPLIER_TYPE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    mapping_date = models.DateField(db_column='MAPPING_DATE', blank=True, null=True)  # Field name made lowercase.
    agreement_term_start = models.DateField(db_column='AGREEMENT_TERM_START', blank=True, null=True)  # Field name made lowercase.
    agreement_term_end = models.DateField(db_column='AGREEMENT_TERM_END', blank=True, null=True)  # Field name made lowercase.
    current_status = models.DateField(db_column='CURRENT_STATUS', blank=True, null=True)  # Field name made lowercase.

    class Meta:

        db_table = 'supplier_info'


class SportsInfra(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    sports_infrastructure_id = models.CharField(db_column='SPORTS_INFRASTRUCTURE_ID', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey('SupplierTypeSociety', related_name='sports', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    stall_spaces_count = models.IntegerField(db_column='STALL_SPACES_COUNT', blank=True, null=True)  # Field name made lowercase.
    banner_spaces_count = models.IntegerField(db_column='BANNER_SPACES_COUNT', blank=True, null=True)
    poster_spaces_count = models.IntegerField(db_column='POSTER_SPACES_COUNT', blank=True, null=True)
    standee_spaces_count = models.IntegerField(db_column='STANDEE_SPACES_COUNT', blank=True, null=True)
    sponsorship_amount_society = models.IntegerField(db_column='SPONSORSHIP_AMOUNT_SOCIETY', blank=True, null=True)
    sponsorship_amount_business = models.IntegerField(db_column='SPONSORSHIP_AMOUNT_BUSINESS)', blank=True, null=True)
    start_date = models.DateField(db_column='START_DATE', blank=True, null=True)
    end_date = models.DateField(db_column='END_DATE', blank=True, null=True)
    outside_participants_allowed = models.CharField(db_column='OUTSIDE_PARTICIPANTS_ALLOWED', max_length=5, blank=True, null=True)
    lit_unlit = models.CharField(db_column='LIT_UNLIT', max_length=5, blank=True, null=True)
    daily_infra_charges_society = models.IntegerField(db_column='DAILY_INFRA_CHARGES_SOCIETY', blank=True, null=True)
    daily_infra_charges_business = models.IntegerField(db_column='DAILY_INFRA_CHARGES_BUSINESS', blank=True, null=True)
    play_areas_count = models.IntegerField(db_column='PLAY_AREAS_COUNT', blank=True, null=True)
    play_area_size = models.IntegerField(db_column='PLAY_AREA_SIZE', blank=True, null=True)
    sports_type = models.CharField(db_column='SPORTS_TYPE', max_length=20, blank=True, null=True)
    photograph_1 = models.CharField(db_column='PHOTOGRAPH_1', max_length=45, blank=True, null=True)  # Field name made lowercase.
    photograph_2 = models.CharField(db_column='PHOTOGRAPH_2', max_length=45, blank=True, null=True)

    class Meta:

        db_table = 'sports_infra'



class SupplierTypeSociety(models.Model):
    supplier_id = models.CharField(db_column='SUPPLIER_ID', primary_key=True, max_length=20)  # Field name made lowercase.
    society_name = models.CharField(db_column='SOCIETY_NAME', max_length=70, blank=True, null=True)  # Field name made lowercase.
    society_address1 = models.CharField(db_column='SOCIETY_ADDRESS1', max_length=250, blank=True, null=True)  # Field name made lowercase.
    society_address2 = models.CharField(db_column='SOCIETY_ADDRESS2', max_length=250, blank=True, null=True)  # Field name made lowercase.
    society_zip = models.IntegerField(db_column='SOCIETY_ZIP', blank=True, null=True)  # Field name made lowercase.
    society_city = models.CharField(db_column='SOCIETY_CITY', max_length=250, blank=True, null=True)  # Field name made lowercase.
    society_state = models.CharField(db_column='SOCIETY_STATE', max_length=250, blank=True, null=True)  # Field name made lowercase.
    society_longitude = models.FloatField(db_column='SOCIETY_LONGITUDE', blank=True, null=True, default=0.0)  # Field name made lowercase.
    society_latitude = models.FloatField(db_column='SOCIETY_LATITUDE', blank=True, null=True, default=0.0)  # Field name made lowercase.
    society_location_type = models.CharField(db_column='SOCIETY_LOCATION_TYPE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    society_type_quality = models.CharField(db_column='SOCIETY_TYPE_QUALITY', max_length=30, blank=True, null=True)  # Field name made lowercase.
    society_type_quantity = models.CharField(db_column='SOCIETY_TYPE_QUANTITY', max_length=30, blank=True, null=True)  # Field name made lowercase.
    flat_count = models.IntegerField(db_column='FLAT_COUNT', blank=True, null=True)  # Field name made lowercase.
    resident_count = models.IntegerField(db_column='RESIDENT_COUNT', blank=True, null=True)  # Field name made lowercase.
    cars_count = models.IntegerField(db_column='CARS_COUNT', blank=True, null=True)  # Field name made lowercase.
    luxury_cars_count = models.IntegerField(db_column='LUXURY_CARS_COUNT', blank=True, null=True)  # Field name made lowercase.
    lift_count = models.IntegerField(db_column='LIFT_COUNT', blank=True, null=True)  # Field name made lowercase.
    machadalo_index = models.FloatField(db_column='MACHADALO_INDEX', blank=True, null=True, default=0.0)  # Field name made lowercase.
    average_rent = models.IntegerField(db_column='AVERAGE_RENT', blank=True, null=True)  # Field name made lowercase.
    food_tasting_allowed = models.CharField(db_column='FOOD_TASTING_ALLOWED', max_length=5, blank=True, null=True)  # Field name made lowercase.
    events_occurance = models.CharField(db_column='EVENTS_OCCURANCE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    preferred_business_type = models.CharField(db_column='SOCIETIES_PREFERRED_BUSINESS_TYPE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    preferred_business_id = models.CharField(db_column='SOCIETIES_PREFERRED_BUSINESS_ID', max_length=50, blank=True, null=True)  # Field name made lowercase.
    business_type_not_allowed = models.CharField(db_column='BUSINESS_TYPE_NOT_ALLOWED', max_length=50, blank=True, null=True)  # Field name made lowercase.
    business_id_not_allowed = models.CharField(db_column='BUSINESS_ID_NOT_ALLOWED', max_length=50, blank=True, null=True)  # Field name made lowercase.
    referred_by = models.CharField(db_column='REFERRED_BY', max_length=5, blank=True, null=True)  # Field name made lowercase.
    contact_person_count = models.IntegerField(db_column='CONTACT_PERSON_COUNT', blank=True, null=True)  # Field name made lowercase.
    walking_area_available = models.CharField(db_column='WALKING_AREA_AVAILABLE', max_length=45, blank=True, null=True)  # Field name made lowercase.
    walking_area_size = models.CharField(db_column='WALKING_AREA_SIZE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    count_0to6 = models.IntegerField(db_column='COUNT_0TO6', blank=True, null=True)  # Field name made lowercase.
    count_6_18 = models.IntegerField(db_column='COUNT_6-18', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    count_19_35 = models.IntegerField(db_column='COUNT_19-35', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    count_36_50 = models.IntegerField(db_column='COUNT_36-50', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    count_50to65 = models.IntegerField(db_column='COUNT_50to65', blank=True, null=True)  # Field name made lowercase.
    count_65above = models.IntegerField(db_column='COUNT_65above', blank=True, null=True)  # Field name made lowercase.
    flat_avg_size = models.IntegerField(db_column='FLAT_AVG_SIZE', blank=True, null=True)  # Field name made lowercase.
    flat_avg_rental_persqft = models.IntegerField(db_column='FLAT_AVG_RENTAL_PERSQFT', blank=True, null=True)  # Field name made lowercase.
    flat_sale_cost_persqft = models.IntegerField(db_column='FLAT_SALE_COST_PERSQFT', blank=True, null=True)  # Field name made lowercase.
    total_ad_spaces = models.IntegerField(db_column='TOTAL_AD_SPACES', blank=True, null=True)  # Field name made lowercase.
    past_collections_stalls = models.IntegerField(db_column='PAST_YEAR_COLLECTIONS_STALLS', null=True)  # Field name made lowercase.
    past_collections_car = models.IntegerField(db_column='PAST_YEAR_COLLECTIONS_CAR', null=True)  # Field name made lowercase.
    past_collections_poster = models.IntegerField(db_column='PAST_YEAR_COLLECTIONS_POSTER', null=True)  # Field name made lowercase.
    past_collections_banners = models.IntegerField(db_column='PAST_YEAR_COLLECTIONS_BANNERS', null=True)  # Field name made lowercase.
    past_collections_standee = models.IntegerField(db_column='PAST_YEAR_COLLECTIONS_STANDEE', null=True)  # Field name made lowercase.
    past_sponsorship_collection_events = models.IntegerField(db_column='PAST_YEAR_SPONSORSHIP_COLLECTION_EVENTS', null=True)  # Field name made lowercase.
    past_total_sponsorship = models.IntegerField(db_column='PAST_YEAR_TOTAL_SPONSORSHIP', null=True)  # Field name made lowercase.

    #notice_board_available = models.CharField(db_column='NOTICE_BOARD_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #stall_available = models.CharField(db_column='STALL_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #car_display_available = models.CharField(db_column='CAR_DISPLAY_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #banner_available = models.CharField(db_column='BANNER_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a gues
    #events_count = models.IntegerField(db_column='EVENTS_COUNT', blank=True, null=True)  # Field name made lowercase.
    #swimming_pool_avaialblity = models.CharField(db_column='SWIMMING_POOL_AVAIALBLITY', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #mail_box_available = models.CharField(db_column='MAIL_BOX_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #door_to_door_allowed = models.CharField(db_column='DOOR_TO_DOOR_ALLOWED', max_length=5,  blank=True, null=True)  # Field name made lowercase. This field typ
    #poster_count = models.IntegerField(db_column='POSTER_COUNT', blank=True, null=True)  # Field name made lowercase.
    #banner_count = models.IntegerField(db_column='BANNER_COUNT', blank=True, null=True)  # Field name made lowercase.
    #wall_count = models.IntegerField(db_column='WALL_COUNT', blank=True, null=True)  # Field name made lowercase.
    #flier_distribution_frequency_per_month = models.IntegerField(db_column='FLIER_DISTRIBUTION_FREQUENCY_PER_MONTH', blank=True, null=True)  # Field name made lowercase.
    #bill_sponsorship_electricity = models.FloatField(db_column='BILL_SPONSORSHIP_ELECTRICITY', default=0.0, blank=True, null=True)  # Field name made lowercase.
    #bill_sponsorship_maintenanace = models.FloatField(db_column='BILL_SPONSORSHIP_MAINTENANACE', default=0.0, blank=True, null=True)  # Field name made lowercase.
    #children_playing_area_available = models.CharField(db_column='CHILDREN_PLAYING_AREA_AVAILABLE', max_length=45, blank=True, null=True)  # Field name made lowercase.
    #children_playing_area_count = models.IntegerField(db_column='CHILDREN_PLAYING_AREA_count', blank=True, null=True)  # Field nam
    #street_furniture_available = models.CharField(db_column='STREET_FURNITURE_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #sports_facility_available = models.CharField(db_column='SPORTS_FACILITY_AVAILABLE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    #swimming_pool_available = models.CharField(db_column='SWIMMING_POOL_AVAILABEL', max_length=5, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    #street_furniture_count = models.IntegerField(db_column='STREET_FURNITURE_COUNT', blank=True, null=True)  # Field name made lowercase.
    #tower_count = models.IntegerField(db_column='TOWER_COUNT', blank=True, null=True)  # Field name made lowercase.
    #standee_count = models.IntegerField(db_column='STANDEE_COUNT', blank=True, null=True)  # Field name made lowercase.



    def get_contact_list(self):
        try:
            return self.contacts.all()
        except:
            return None

    def get_reference(self):
        try:
            return self.contacts.all().get(contact_type="Reference")
        except:
            return None

    def is_contact_available(self):
        contacts = self.get_contact_list()
        if contacts and len(contacts) > 0 :
            return True
        return False

    def is_reference_available(self):
        if self.get_reference():
            return True
        return False

    def is_past_details_available(self):
        if (self.past_collections_poster is not None or self.past_collections_stalls is not None or self.past_total_sponsorship is not None):
            return True
        return False


    def is_business_preferences_available(self):
        if (self.preferred_business_type is not None or self.business_type_not_allowed is not None):
            return True
        return False

    class Meta:

        db_table = 'supplier_society'




class SocietyTower(models.Model):
    tower_id = models.AutoField(db_column='TOWER_ID', primary_key=True)  # Field name made lowercase.
    tower_tag = models.CharField(db_column='TOWER_TAG', max_length=20, blank=True, null=True)  # Field name made lowercase.
    supplier = models.ForeignKey(SupplierTypeSociety, related_name='towers', db_column='SUPPLIER_ID', blank=True, null=True)  # Field name made lowercase.
    tower_name = models.CharField(db_column='TOWER_NAME', max_length=20, blank=True, null=True)  # Field name made lowercase.
    flat_count_per_tower = models.IntegerField(db_column='FLAT_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    floor_count_per_tower = models.IntegerField(db_column='FLOOR_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    notice_board_count_per_tower = models.IntegerField(db_column='NOTICE_BOARD_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    standee_location_count_per_tower = models.IntegerField(db_column='STANDEE_LOCATION_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    mailbox_count_per_tower = models.IntegerField(db_column='MAILBOX_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    stall_count_per_tower = models.IntegerField(db_column='STALL_COUNT_PER_TOWER', blank=True, null=True)  # Field name made lowercase.
    tower_location = models.CharField(db_column='TOWER_LOCATION', max_length=100, blank=True, null=True)  # Field name made lowercase.
    tower_resident_count = models.IntegerField(db_column='TOWER_RESIDENT_COUNT', blank=True, null=True)  # Field name made lowercase.
    lift_count = models.IntegerField(db_column='LIFT_COUNT', blank=True, null=True)  # Field name made lowercase.
    average_rent_per_sqft = models.IntegerField(db_column='AVERAGE_RENT_PER_SQFT', blank=True, null=True)  # Field name made lowercase.


    def get_notice_board_list(self):
        return self.notice_boards.all()

    def get_lift_list(self):
        return self.lifts.all()

    def get_flat_list(self):
        return self.flats.all()

    def is_notice_board_available(self):
        notice_board = self.get_notice_board_list()
        if notice_board and len(notice_board) > 0 :
            return True
        return False

    def is_lift_available(self):
        lift = self.get_lift_list()
        if lift and len(lift) > 0:
            return True
        return False

    def is_flat_available(self):
        flat = self.get_flat_list()
        if flat and len(flat) > 0:
            return True
        return False


    class Meta:

        db_table = 'society_tower'
