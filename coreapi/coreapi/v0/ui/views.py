from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from serializers import UISocietySerializer, UITowerSerializer
from v0.serializers import InventoryLocationSerializer, AdInventoryLocationMappingSerializer, AdInventoryTypeSerializer, DurationTypeSerializer, PriceMappingDefaultSerializer, PriceMappingSerializer, BannerInventorySerializer, CarDisplayInventorySerializer, CommunityHallInfoSerializer, DoorToDoorInfoSerializer, LiftDetailsSerializer, NoticeBoardDetailsSerializer, PosterInventorySerializer, SocietyFlatSerializer, StandeeInventorySerializer, SwimmingPoolInfoSerializer, WallInventorySerializer, UserInquirySerializer, CommonAreaDetailsSerializer, ContactDetailsSerializer, EventsSerializer, InventoryInfoSerializer, MailboxInfoSerializer, OperationsInfoSerializer, PoleInventorySerializer, PosterInventoryMappingSerializer, RatioDetailsSerializer, SignupSerializer, StallInventorySerializer, StreetFurnitureSerializer, SupplierInfoSerializer, SupplierTypeSocietySerializer, SocietyTowerSerializer
from v0.models import InventoryLocation, AdInventoryLocationMapping, AdInventoryType, DurationType, PriceMappingDefault, PriceMapping, BannerInventory, CarDisplayInventory, CommunityHallInfo, DoorToDoorInfo, LiftDetails, NoticeBoardDetails, PosterInventory, SocietyFlat, StandeeInventory, SwimmingPoolInfo, WallInventory, UserInquiry, CommonAreaDetails, ContactDetails, Events, InventoryInfo, MailboxInfo, OperationsInfo, PoleInventory, PosterInventoryMapping, RatioDetails, Signup, StallInventory, StreetFurniture, SupplierInfo, SupplierTypeSociety, SocietyTower



class SocietyAPIView(APIView):
    def get(self, request, id, format=None):
        try:
            item = SupplierTypeSociety.objects.get(pk=id)
            serializer = UISocietySerializer(item)
            return Response(serializer.data)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)


class SocietyAPIListView(APIView):
    def post(self, request, format=None):
        print request.data
        item = SupplierTypeSociety.objects.filter(pk=request.data['supplier_id']).first()
        if item:
            serializer = SupplierTypeSocietySerializer(item,data=request.data)
        else:
            serializer = SupplierTypeSocietySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)

        print serializer.data
        #here we will start storing contacts
        if request.data and request.data['basic_contact_available']:
            for contact in request.data['basic_contacts']:
                contact_serializer = ContactDetailsSerializer(data=contact)
                if contact_serializer.is_valid():
                    contact_serializer.save(supplier_id=request.data['supplier_id'])

        if request.data and request.data['basic_reference_available']:
            for contact in request.data['basic_reference_contacts']:
                contact_serializer = ContactDetailsSerializer(data=contact)
                if contact_serializer.is_valid():
                    contact_serializer.save(supplier_id=request.data['supplier_id'])

        society = SupplierTypeSociety.objects.filter(pk=serializer.data['supplier_id']).first()
        ad_types = AdInventoryType.objects.all()
        duration_types = DurationType.objects.all()
        for type in ad_types:
            for duration in duration_types:
                pmdefault = PriceMappingDefault(supplier= society, adinventory_type=type, duration_type=duration, society_price=0, business_price=0)
                pmdefault.save()

        return Response(serializer.data, status=201)



class BasicPricingAPIView(APIView):
    def get(self, request, id, format=None):
        try:
            basic_prices = SupplierTypeSociety.objects.get(pk=id).default_prices.all()
            serializer = PriceMappingDefaultSerializer(basic_prices, many=True)
            return Response(serializer.data)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)
        except PriceMappingDefault.DoesNotExist:
            return Response(status=404)



class TowerAPIView(APIView):
    def get(self, request, id, format=None):
        try:
            towers = SupplierTypeSociety.objects.get(pk=id).towers.all()
            serializer = UITowerSerializer(towers, many=True)
            return Response(serializer.data)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)
        except SocietyTower.DoesNotExist:
            return Response(status=404)

    def post(self, request, id, format=None):
        print request.data
        serializer={}
        society=SupplierTypeSociety.objects.get(pk=id)
        for key in request.data['TowerDetails']:
            if 'tower_id' in key:
                item = SocietyTower.objects.get(pk=key['tower_id'])
                serializer = SocietyTowerSerializer(item, data=key)
            else:
                serializer = SocietyTowerSerializer(data=key)
            try:
                if serializer.is_valid():
                    serializer.save(supplier=society)
                  #  tower_data=serializer.data
            except:
                return Response(serializer.errors, status=400)

            try:
                tower_data = SocietyTower.objects.get(pk=serializer.data['tower_id'])
            except SocietyTower.DoesNotExist:
                return Response(status=404)


            if key['notice_board_details_available']:
                for notice_board in key['notice_board_details']:
                    if 'id' in notice_board:
                        notice_item = NoticeBoardDetails.objects.get(pk=notice_board['id'])
                        notice_serializer = NoticeBoardDetailsSerializer(notice_item, data=notice_board)
                    else:
                        notice_serializer = NoticeBoardDetailsSerializer(data=notice_board)

                    if notice_serializer.is_valid():
                        notice_serializer.save(tower=tower_data)
                    else:
                        #transaction.rollback()
                        return Response(notice_serializer.errors, status=400)

            if key['lift_details_available']:
                for lift in key['lift_details']:
                    if 'id' in lift:
                        lift_item = LiftDetails.objects.get(pk=lift['id'])
                        lift_serializer = LiftDetailsSerializer(lift_item,data=lift)
                    else:
                        lift_serializer = LiftDetailsSerializer(data=lift)

                    if lift_serializer.is_valid():
                        lift_serializer.save(tower=tower_data)
                    else:
                        return Response(lift_serializer.errors, status=400)

            if key['flat_details_available']:
                for flat in key['flat_details']:
                    if 'id' in flat:
                        flat_item = SocietyFlat.objects.get(pk=flat['id'])
                        flat_serializer=SocietyFlatSerializer(flat_item,data=flat)
                    else:
                        flat_serializer = SocietyFlatSerializer(data=flat)

                    if flat_serializer.is_valid():
                        flat_serializer.save(tower=tower_data)
                    else:
                        return Response(flat_serializer.errors, status=400)

        return Response(status=201)

        #here we will start storing contacts


class CarDisplayAPIView(APIView):
    def get(self, request, id, format=None):
        try:
            car_displays = SupplierTypeSociety.objects.get(pk=id).car_displays.all()
            serializer = CarDisplayInventorySerializer(car_displays, many=True)
            len(serializer.data)
            if len(serializer.data) > 0:
                car_display_available=True
            else:
                car_display_available = False

            response = {}
            response['car_display_available'] = car_display_available
            response['car_display_details'] = serializer.data

            return Response(response, status=200)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)
        except CarDisplayInventory.DoesNotExist:
            return Response(status=404)

    def post(self, request, id, format=None):
        print request.data
        society=SupplierTypeSociety.objects.get(pk=id)

        for key in request.data['car_display_details']:
            if 'id' in key:
                print "test loop"
                item = CarDisplayInventory.objects.get(pk=key['id'])
                serializer = CarDisplayInventorySerializer(item, data=key)
            else:
                serializer = CarDisplayInventorySerializer(data=key)
            try:
                if serializer.is_valid():
                    serializer.save(supplier=society)
            except:
                return Response(serializer.errors, status=400)

        return Response(serializer.data, status=201)
        #here we will start storing contacts



class EventAPIView(APIView):
    def get(self, request, id, format=None):
        try:
            events = SupplierTypeSociety.objects.get(pk=id).events.all()
            serializer = EventsSerializer(events, many=True)
            count = len(serializer.data)
            if count > 0:
                event_details_available=True
            else:
                event_details_available = False

            response = {}
            response['events_count_per_year'] = count
            response['event_details_available'] = event_details_available
            response['event_details'] = serializer.data

            return Response(response, status=200)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)
        except Events.DoesNotExist:
            return Response(status=404)

    def post(self, request, id, format=None):
        print request.data
        society=SupplierTypeSociety.objects.get(pk=id)
        if request.data['event_details_available']:
            if request.data['events_count_per_year'] != len(request.data['event_details']):
                return Response({'message':'No of Events entered does not match event count'},status=400)

        for key in request.data['event_details']:
            if 'event_id' in key:
                item = Events.objects.get(pk=key['event_id'])
                serializer = EventsSerializer(item, data=key)
            else:
                serializer = EventsSerializer(data=key)
            try:
                if serializer.is_valid():
                    serializer.save(supplier=society)
            except:
                return Response(serializer.errors, status=400)

        return Response(serializer.data, status=201)
        #here we will start storing contacts


class OtherInventoryAPIView(APIView):
    def get(self, request, id, format=None):
        response = {}
        try:
            poles = SupplierTypeSociety.objects.get(pk=id).poles.all()
            serializer = PoleInventorySerializer(poles, many=True)
            pole_available = get_availability(serializer.data)
            response['pole_available'] = pole_available
            response['pole_display_details'] = serializer.data

            walls = SupplierTypeSociety.objects.get(pk=id).walls.all()
            serializer = WallInventorySerializer(walls, many=True)
            wall_available = get_availability(serializer.data)
            response['wall_available'] = wall_available
            response['wall_display_details'] = serializer.data

            community_halls = SupplierTypeSociety.objects.get(pk=id).community_halls.all()
            serializer = CommunityHallInfoSerializer(community_halls, many=True)
            community_hall_available = get_availability(serializer.data)
            response['community_hall_available'] = community_hall_available
            response['community_hall_details'] = serializer.data

            swimming_pools = SupplierTypeSociety.objects.get(pk=id).swimming_pools.all()
            serializer = SwimmingPoolInfoSerializer(swimming_pools, many=True)
            swimming_pool_available = get_availability(serializer.data)
            response['swimming_pool_available'] = swimming_pool_available
            response['swimming_pool_details'] = serializer.data

            mail_boxes = SupplierTypeSociety.objects.get(pk=id).mail_boxes.all()
            serializer = MailboxInfoSerializer(mail_boxes, many=True)
            mail_box_available = get_availability(serializer.data)
            response['mail_box_available'] = mail_box_available
            response['mail_box_details'] = serializer.data


            door_to_doors = SupplierTypeSociety.objects.get(pk=id).door_to_doors.all()
            serializer = DoorToDoorInfoSerializer(door_to_doors, many=True)
            door_to_door_allowed = get_availability(serializer.data)
            response['door_to_door_allowed'] = door_to_door_allowed
            response['door_to_door_details'] = serializer.data

            street_furniture = SupplierTypeSociety.objects.get(pk=id).street_furniture.all()
            serializer = StreetFurnitureSerializer(street_furniture, many=True)
            street_furniture_available = get_availability(serializer.data)
            response['street_furniture_available'] = street_furniture_available
            response['street_furniture_details'] = serializer.data

            return Response(response, status=200)
        except SupplierTypeSociety.DoesNotExist:
            return Response(status=404)
        except PoleInventory.DoesNotExist:
            return WallInventory(status=404)
        except CommunityHallInfo.DoesNotExist:
            return Response(status=404)
        except SwimmingPoolInfo.DoesNotExist:
            return Response(status=404)
        except MailboxInfo.DoesNotExist:
            return Response(status=404)
        except DoorToDoorInfo.DoesNotExist:
            return Response(status=404)
        except WallInventory.DoesNotExist:
            return Response(status=404)
        except StreetFurniture.DoesNotExist:
            return Response(status=404)

    def post(self, request, id, format=None):
        print request.data
        society = SupplierTypeSociety.objects.get(pk=id)

        if request.data['pole_available']:
            response = post_data(PoleInventory, PoleInventorySerializer, request.data['pole_display_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['wall_available']:
            response = post_data(WallInventory, WallInventorySerializer, request.data['wall_display_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['community_hall_available']:
            response = post_data(CommunityHallInfo, CommunityHallInfoSerializer, request.data['community_hall_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['wall_available']:
            response = post_data(WallInventory, WallInventorySerializer, request.data['wall_display_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['swimming_pool_available']:
            response = post_data(SwimmingPoolInfo, SwimmingPoolInfoSerializer, request.data['swimming_pool_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['mail_box_available']:
            response = post_data(MailboxInfo, MailboxInfoSerializer, request.data['mail_box_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['door_to_door_allowed']:
            response = post_data(DoorToDoorInfo, DoorToDoorInfoSerializer, request.data['door_to_door_details'], society)
            if response == False:
                return Response(status=400)

        if request.data['street_furniture_available']:
            response = post_data(StreetFurniture, StreetFurnitureSerializer, request.data['street_furniture_details'], society)
            if response == False:
                return Response(status=400)

        return Response(status=201)
        #here we will start storing contacts


def post_data(model, model_serializer, inventory_data, foreign_value=None):

    for key in inventory_data:
        if 'id' in key:
            item = model.objects.get(pk=key['id'])
            serializer = model_serializer(item,data=key)
        else:
            serializer = model_serializer(data=key)
        if serializer.is_valid():
            serializer.save(supplier=foreign_value)
        else:
            return False
    return True

def get_availability(data):
     if len(data) > 0:
        return True
     else:
         return False



    




