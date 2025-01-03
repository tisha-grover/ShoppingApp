from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'image', 'category', 'created_at')  # Ensure these fields exist
    readonly_fields = ('created_at',)  # Verify the second field here is valid

    # Additional options (optional)
    search_fields = ('title', 'category')
    list_filter = ('category', 'created_at')