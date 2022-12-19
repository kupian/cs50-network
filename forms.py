from django import forms
from .models import *

class NewPost(forms.Form):
    content = forms.CharField(max_length=256, label="", widget=forms.Textarea(attrs={
        "class": "form-control",
        "placeholder": "Write a new post...",
        "rows": "2"
    }))