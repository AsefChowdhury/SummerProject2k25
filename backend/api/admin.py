from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import CustomUser, Deck, Flashcard
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("id", "email", "username", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "is_staff", "is_active"),
        }),
    )
    search_fields = ("email", "username")
    ordering = ("email",)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Deck)
admin.site.register(Flashcard)

