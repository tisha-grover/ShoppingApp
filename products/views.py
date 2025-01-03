from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Product, Cart
from .serializers import ProductSerializer, CartSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


# Product List View with Filters
class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            products = Product.objects.all()
            search = request.query_params.get("search", "")
            max_price = request.query_params.get("price", None)
            category = request.query_params.get("category", "")

            # Apply filters
            if search:
                products = products.filter(title__icontains=search)
            if max_price:
                products = products.filter(price__lte=max_price)
            if category:
                products = products.filter(category__icontains=category)

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "Product ID is required."}, status=400)

        try:
            product = Product.objects.get(id=product_id)
            cart_item, created = Cart.objects.get_or_create(
                user=request.user,
                product=product,
                defaults={"quantity": 1},
            )
            if not created:
                cart_item.quantity += 1
                cart_item.save()

            return Response({"message": "Product added to cart."}, status=201)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=404)
        
# Single Product Detail View
class ProductDetailView(APIView):
    permission_classes = [AllowAny]  # Allow access to product details without authentication

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


# Register View
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to register

    def post(self, request):
        try:
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')

            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, email=email, password=password)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Logout View
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()  # Blacklist the refresh token
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
