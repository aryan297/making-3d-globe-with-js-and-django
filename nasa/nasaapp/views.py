from django.shortcuts import render
from django.http import *

# Create your views here.

def earth(request):
    return render(request,'earth.html')
def earth2(request):
    return render(request,'earth2.html')

def earth3(request):
    return render(request,'earth3.html')

def earth4(request):
    return render(request,'earth4.html')
