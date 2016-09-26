from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from v0.models import BannerInventory, CommunityHallInfo, DoorToDoorInfo, LiftDetails, NoticeBoardDetails, PosterInventory, SocietyFlat, StandeeInventory, SwimmingPoolInfo, WallInventory, UserInquiry, CommonAreaDetails, ContactDetails, Events, InventoryInfo, MailboxInfo, OperationsInfo, PoleInventory, PosterInventoryMapping, RatioDetails, Signup, StallInventory, StreetFurniture, SupplierInfo, SupplierTypeSociety, SocietyTower, SupplierTypeCorporate, SupplierTypeSalon, SupplierTypeGym
from v0.serializers import BannerInventorySerializer, CommunityHallInfoSerializer, DoorToDoorInfoSerializer, LiftDetailsSerializer, NoticeBoardDetailsSerializer, PosterInventorySerializer, SocietyFlatSerializer, StandeeInventorySerializer, SwimmingPoolInfoSerializer, WallInventorySerializer, UserInquirySerializer, CommonAreaDetailsSerializer, ContactDetailsSerializer, EventsSerializer, InventoryInfoSerializer, MailboxInfoSerializer, OperationsInfoSerializer, PoleInventorySerializer, PosterInventoryMappingSerializer, RatioDetailsSerializer, SignupSerializer, StallInventorySerializer, StreetFurnitureSerializer, SupplierInfoSerializer, SupplierTypeSocietySerializer, SocietyTowerSerializer, ImageMappingSerializer

class UISocietySerializer(ModelSerializer):
    basic_contact_available = serializers.BooleanField(source='is_contact_available')
    basic_contacts = ContactDetailsSerializer(source='get_contact_list', many=True)
    basic_reference_available = serializers.BooleanField(source='is_reference_available')
    basic_reference_contacts = ContactDetailsSerializer(source='get_reference')
    society_image = ImageMappingSerializer(source='get_society_image')
    past_details = serializers.BooleanField(source='is_past_details_available')
    demographic_details_available = serializers.BooleanField(source='is_demographic_details_available')
    business_preferences = serializers.BooleanField(source='is_business_preferences_available')
    class Meta:
        model = SupplierTypeSociety
        read_only_fields = (
        'basic_contact_available',
        'basic_contacts',
        'basic_reference_available',
        'basic_reference_contacts',
        'past_details',
        'business_preferences',
        'society_image'
        )

class UICorporateSerializer(ModelSerializer):
    class Meta:
        model = SupplierTypeCorporate


class UISalonSerializer(ModelSerializer):
    class Meta:
        model = SupplierTypeSalon


class UIGymSerializer(ModelSerializer):
    class Meta:
        model = SupplierTypeGym

class SocietyListSerializer(ModelSerializer):
    society_image = ImageMappingSerializer(source='get_society_image')
    class Meta:
        model = SupplierTypeSociety
        fields = (
            'supplier_id',
            'society_name',
            'society_address1',
            'society_address2',
            'society_city',
            'society_state',
            'machadalo_index',
            'society_type_quality',
            'society_location_type',
            'society_image',
        )


class UITowerSerializer(ModelSerializer):
    flat_type_details_available = serializers.BooleanField(source='is_flat_available')
    flat_type_details = SocietyFlatSerializer(source='get_flat_list', many=True)

    class Meta:
        model = SocietyTower
        read_only_fields = (
        'flat_type_details_available',
        'flat_type_details',
        )

class UIPosterSerializer(ModelSerializer):
    #notice_board_details_available = serializers.BooleanField(source='is_notice_board_available')
    #notice_board_details = NoticeBoardDetailsSerializer(source='get_notice_board_list', many=True)
    #lift_details_available = serializers.BooleanField(source='is_lift_available')
    #lift_details = LiftDetailsSerializer(source='get_lift_list', many=True)
    #basic_reference_contacts = serializers.ListField(source='get_reference')
    class Meta:
        model = SocietyTower
        read_only_fields = (
        #'notice_board_details_available',
        'flat_type_details_available',
        #'lift_details_available',
        'flat_type_details',
        #'notice_board_details',
        #'lift_details',
        )
