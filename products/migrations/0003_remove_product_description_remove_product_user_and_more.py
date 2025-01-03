# Generated by Django 4.2.17 on 2024-12-31 19:54

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_alter_product_image_cart_wishlist"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="description",
        ),
        migrations.RemoveField(
            model_name="product",
            name="user",
        ),
        migrations.AddField(
            model_name="product",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="product",
            name="created_at",
            field=models.DateTimeField(
                default=django.utils.timezone.now, editable=False
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.ImageField(default="default_image.jpg", upload_to="products/"),
        ),
    ]
